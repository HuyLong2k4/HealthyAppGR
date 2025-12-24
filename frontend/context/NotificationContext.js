import { createContext, useState } from "react";
import { useAuth } from './AuthContext';

export const NotificationContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const NotificationProvider = ({ children }) => {
    const { token, logout } = useAuth();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ notification, setNotification ] = useState([]);

    const fetchAllNotification = async (filters = {}) => {
        try {
            setIsLoading(true);

            // Cơ chế ngắt kết nối tự động
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);  

            const response = await fetch(`${API_URL}/notifications/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                signal: controller.signal,
            })

            clearTimeout(timeoutId);

            if (response.status === 401) {
                await logout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch notifications');
            }

            const result = await response.json();
            const data = result.data || result;
            setNotification(data || []);
            return data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotification([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNotification = async (notificationId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                await logout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete notifications');
            }

            await fetchAllNotification();
            return true;
        } catch (error) {
            console.error('Error deleting notifications:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notification,
                isLoading,
                fetchAllNotification,
                deleteNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
} 