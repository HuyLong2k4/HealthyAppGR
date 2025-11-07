import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const HealthIndexContext = createContext();

const getErrorFromResponse = async (response) => {
    try {
        const jsonError = await response.json();
        return jsonError.error || "Lỗi không xác định từ server.";
    } catch (_e) {
        try {
            const textError = await response.text();
            return textError.substring(0, 150) || `Lỗi ${response.status}`;
        } catch (_textE) {
            return `Lỗi ${response.status}: Không thể đọc phản hồi lỗi.`;
        }
    }
};

export const HealthIndexProvider = ({ children }) => {
    const [ healthIndexes, setHealthIndexes ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const { token, user, logout } = useAuth();

    // Get userId - support both _id and id
    const userId = user?._id || user?.id;

    const fetchHealthIndexes = useCallback(async () => {
        if (!token || !userId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/health-indices/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                
                // Nếu token không hợp lệ, tự động logout
                if (response.status === 401) {
                    console.error("🔒 Token không hợp lệ, đang logout...");
                    await logout();
                    Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
                    return;
                }
                
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setHealthIndexes(data);
        } catch (err) {
            console.error("Lỗi khi tải chỉ số sức khỏe:", err);
        } finally {
            setIsLoading(false);
        }
    }, [token, userId, logout]);

    useEffect(() => {
        if (token && userId) {
            fetchHealthIndexes();
        } else {
            setHealthIndexes([]);
        }
    }, [token, userId, fetchHealthIndexes]);

    const createHealthIndex = useCallback(async (indexesData) => {
        if (!token || !userId) {
            console.error("❌ Missing token or userId:", { token: !!token, userId: userId });
            Alert.alert("Lỗi", "Bạn chưa đăng nhập hoặc thông tin người dùng không hợp lệ.");
            return;
        }

        console.log("📤 Đang gửi health index:", {
            ...indexesData,
            user: userId
        });

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/health-indices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...indexesData,
                    user: userId // Thêm userId vào body (support cả _id và id)
                }),
            });

            console.log("📥 Response status:", response.status);

            if (!response.ok) {
                const errorMsg = await getErrorFromResponse(response);
                console.error("❌ Server error:", errorMsg);
                Alert.alert("Lỗi", errorMsg);
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log("✅ Tạo thành công:", result);

            // Không alert ở đây, để AddHealthIndex tự handle
            await fetchHealthIndexes();
            
        } catch (err) {
            console.error("❌ Lỗi khi tạo chỉ số sức khỏe:", err);
            // Không alert ở đây, throw để AddHealthIndex tự handle
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [token, userId, fetchHealthIndexes]);

    const value = {
        healthIndexes,
        isLoading,
        createHealthIndex,
        refreshHealthIndexes: fetchHealthIndexes,
    }

    return (
        <HealthIndexContext.Provider value={value}>
            {children}
        </HealthIndexContext.Provider>
    );
};

export const useHealthIndexes = () => useContext(HealthIndexContext);