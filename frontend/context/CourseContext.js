import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

// --- Cấu hình ---
const API_URL = 'http://192.168.0.229:5000/api'; 

// --- Tạo Context ---
const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const fetchCourses = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Không thể tải danh sách khóa học.");
            }
            
            setCourses(data); 

        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
            Alert.alert("Lỗi", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]); 

    useEffect(() => {
        if (token) {
            fetchCourses();
        } else {
            setCourses([]);
        }
    }, [token, fetchCourses]);

    const createCourse = async (courseData) => {
        if (!token) {
            Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(courseData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Tạo khóa học thất bại.");
            }
            
            setCourses(prev => [result, ...prev]);
            Alert.alert("Thành công", "Khóa học đã được tạo.");
            return true;

        } catch (error) {
            console.error("Lỗi khi tạo khóa học:", error);
            Alert.alert("Lỗi", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCourse = async (courseId, updateData) => {
        if (!token) {
            Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cập nhật khóa học thất bại.');
            }

            setCourses(prevCourses => 
                prevCourses.map(c => c._id === courseId ? result : c)
            );
            Alert.alert("Thành công", "Khóa học đã được cập nhật.");
            return true;

        } catch (error) {
            console.error("Lỗi khi cập nhật khóa học:", error);
            Alert.alert("Lỗi", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourse = async (courseId) => {
        if (!token) {
            Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Xóa khóa học thất bại.');
            }

            setCourses(prevCourses => 
                prevCourses.filter(course => course._id !== courseId)
            );
            Alert.alert("Thành công", "Khóa học đã được xóa.");
            return true;

        } catch (error) {
            console.error("Lỗi khi xóa khóa học:", error);
            Alert.alert("Lỗi", error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        courses,
        isLoading,
        createCourse,
        updateCourse,
        deleteCourse,
        refreshCourses: fetchCourses,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};


export const useCourse = () => useContext(CourseContext);