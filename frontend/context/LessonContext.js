import { createContext, useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
// BỔ SUNG: Import useAuth
import { useAuth } from "./AuthContext";

// SỬA: Chuẩn hóa API_URL
const API_URL = "http://192.168.1.46:5000/api";

// SỬA: Đổi tên thành LessonContext
const LessonContext = createContext();

// Hàm getErrorFromResponse của bạn đã tốt
const getErrorFromResponse = async (response) => {
    try {
        const jsonError = await response.json();
        return jsonError.error || "Lỗi không xác định từ server.";
    } catch (e) {
        try {
            const textError = await response.text();
            return textError.substring(0, 150) || `Lỗi ${response.status}`;
        } catch (textE) {
            return `Lỗi ${response.status}: Không thể đọc phản hồi lỗi.`;
        }
    }
};

export const LessonProvider = ({ children }) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ lessons, setLessons ] = useState([]);

    const { token } = useAuth();

    const [currentCourseId, setCurrentCourseId] = useState(null);

    const loadLessonsByCourse = useCallback(async (courseId) => {
        if (!token) return;

        if (!courseId) {
            setLessons([]);
            setCurrentCourseId(null);
            return;
        }

        setCurrentCourseId(courseId);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/lessons/course/${courseId}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg); 
            }

            const data = await response.json();
            setLessons(data);

        } catch(err) {
            console.error("Lỗi khi tải danh sách bài học", err); 
            Alert.alert("Lỗi", err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const refreshLessons = useCallback(async () => {
        if (!currentCourseId) return; 
        await loadLessonsByCourse(currentCourseId);
    }, [currentCourseId, loadLessonsByCourse]);

    const createLesson = useCallback(async (lessonData) => {
        if (!token) {
            Alert.alert("Lỗi", "Yêu cầu đăng nhập");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/lessons`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(lessonData),
            });

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response); 
                throw new Error(errorMsg || "Tạo bài học thất bại"); 
            }

            const newLesson = await response.json();
            setLessons(prevLessons => [...prevLessons, newLesson]);
            setCurrentCourseId(lessonData.course);

            Alert.alert("Thành công", "Bài học đã được tạo"); 
            return true;
        } catch(err) {
            console.error("Lỗi khi tạo bài học:", err); 
            Alert.alert("Lỗi", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [token, loadLessonsByCourse]);

    // SỬA: Đổi tên hàm
    const updateLesson = useCallback(async (lessonId, updateData) => {
        if(!token) {
            Alert.alert("Lỗi", "Yêu cầu đăng nhập");
            return false;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/lessons/${lessonId}`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                // SỬA: Thông báo đúng
                throw new Error(errorMsg || 'Cập nhật bài học thất bại'); 
            }

            if (currentCourseId) {
                await loadLessonsByCourse(currentCourseId);
            }

            Alert.alert("Thành công", "Bài học đã được cập nhật"); 
            return true;
        } catch (err) {
            // SỬA: Thông báo đúng
            console.error("Lỗi khi cập nhật bài học", err); 
            Alert.alert("Lỗi", err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [token, currentCourseId, loadLessonsByCourse]);

    // SỬA: Đổi tên hàm
    const deleteLesson = useCallback(async (lessonId) => {
        if (!token) {
            Alert.alert("Lỗi", "Lỗi khi đăng nhập.");
            return false; 
        }

        setIsLoading(true);
        try {
            // SỬA: Gọi đúng API
            const response = await fetch(`${API_URL}/lessons/${lessonId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                // SỬA: Thông báo đúng
                throw new Error(errorMsg || 'Xóa bài học thất bại.'); 
            }

            if (currentCourseId) {
                await loadLessonsByCourse(currentCourseId);
            }

            // SỬA: Thông báo đúng
            Alert.alert("Thành công", "Bài học đã được xóa."); 
            return true;

        } catch (error) {
            // SỬA: Thông báo đúng
            console.error("Lỗi khi xóa bài học:", error); 
            Alert.alert("Lỗi", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [token, currentCourseId, loadLessonsByCourse]);

    const value = {
        lessons, 
        isLoading,
        createLesson, 
        updateLesson, 
        deleteLesson, 
        refreshLessons,
        loadLessonsByCourse,
    };

    return (
        <LessonContext.Provider value={value}> 
            {children}
        </LessonContext.Provider>
    )
};

export const useLesson = () => useContext(LessonContext);