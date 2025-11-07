import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL; 

const CourseContext = createContext();

const getErrorFromResponse = async (response) => {
    try {
        const jsonError = await response.json();
        return jsonError.error || "Lỗi không xác định từ server.";
    } catch (e) {
        const textError = await response.text();
        return textError || `Lỗi ${response.status}: Server không phản hồi JSON.`;
    }
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token, logout } = useAuth();

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

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);

                if (response.status === 401) {
                    console.error("Token không hợp lệ, đang logout...");
                    await logout();
                    Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
                    return;
                }
                
                throw new Error(errorMsg);
            }
            
            const data = await response.json();
            setCourses(data); 

        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
            Alert.alert("Lỗi", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token, logout]); 

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
            
            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg || 'Tạo khóa học thất bại.');
            }

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

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg || 'Cập nhật khóa học thất bại.');
            }

            const result = await response.json();
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
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg || 'Xóa khóa học thất bại.');
            }
            
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
