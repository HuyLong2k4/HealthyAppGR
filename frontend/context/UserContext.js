import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const UserProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tất cả người dùng
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout: Failed to fetch users');
      } else {
        console.error('Error fetching users:', error);
      }
      // Return empty array instead of throwing to prevent app crash
      setUsers([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thông tin người dùng theo ID
  const getUserById = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
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
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  // Tạo người dùng mới
  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data = await response.json();
      await fetchAllUsers(); // Refresh danh sách
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // Cập nhật người dùng
  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const data = await response.json();
      await fetchAllUsers(); // Refresh danh sách
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Xóa người dùng
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
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
        throw new Error('Failed to delete user');
      }

      await fetchAllUsers(); // Refresh danh sách
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        isLoading,
        fetchAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
