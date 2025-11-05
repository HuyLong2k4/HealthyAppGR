import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

const API_URL = "http://192.168.1.46:5000/api";

const EnrollmentContext = createContext();

const getErrorFromResponse = async (response) => {
    try {
        const jsonError = await response.json();
        return jsonError.error || "Lỗi không xác định từ server.";
    } catch (e) {
        try {
            // Thử đọc dưới dạng text
            const textError = await response.text();
             // Cắt ngắn nếu nó là một trang HTML dài
            return textError.substring(0, 150) || `Lỗi ${response.status}`;
        } catch (textE) {
            // Nếu không thể đọc text
            return `Lỗi ${response.status}: Không thể đọc phản hồi lỗi.`;
        }
    }
};


export const EnrollmentProvider = ({ children }) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ enrollment, setEnrollment ] = useState([]);

    const { token } = useAuth();

    // Tải danh sách các khóa học đã đăng ký
    const fetchEnrollment = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/enrollments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            // --- CẬP NHẬT: Kiểm tra OK trước ---
            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setEnrollment(data);

        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
            Alert.alert("Lỗi", error.message);
        }  finally {
            setIsLoading(false);
        }
    }, [token]); 

    // Tự động tải khi có token
    useEffect(() => {
        if(token) {
            fetchEnrollment();
        } else {
            setEnrollment([]);
        }
    }, [token, fetchEnrollment]);

    // Chức năng đăng ký khóa học
    const enrollInCourse = useCallback(async (courseId) => {
        if (!token) return false;
        
        // Không cần setIsLoading ở đây, vì nó có thể làm toàn bộ
        // màn hình bị mờ chỉ vì 1 cái click, trừ khi bạn muốn vậy.
        
        try {
            const response = await fetch(`${API_URL}/enrollments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // Đã sửa đúng key
                body: JSON.stringify({ course: courseId }) 
            });

            // --- CẬP NHẬT: Kiểm tra OK trước ---
            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                throw new Error(errorMsg);
            }

            const data = await response.json(); 

            Alert.alert("Thành công", data.message || "Đăng ký khóa học thành công!");
            await fetchEnrollment(); // Tải lại danh sách
            return true;
        } catch (error) {
            console.error("Lỗi khi đăng ký khóa học:", error);
            Alert.alert("Lỗi", error.message); 
            return false;
        }
    }, [token, fetchEnrollment]);


    const value = {
        enrollment,
        isLoading,
        refreshEnrollment: fetchEnrollment,
        enrollInCourse,
    };

    return (
        <EnrollmentContext.Provider value={value}>
            {children}
        </EnrollmentContext.Provider>
    )
}

export const useEnrollment = () => useContext(EnrollmentContext);