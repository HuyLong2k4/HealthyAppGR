import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const DoctorContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const DoctorProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tất cả bác sĩ
  const fetchAllDoctors = async (filters = {}) => {
    try {
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.title) queryParams.append('title', filters.title);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/doctors${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
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
        throw new Error('Failed to fetch doctors');
      }

      const result = await response.json();
      // Backend returns { success, count, data }
      const data = result.data || [];
      setDoctors(data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout: Failed to fetch doctors');
      } else {
        console.error('Error fetching doctors:', error);
      }
      setDoctors([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thông tin bác sĩ theo ID
  const getDoctorById = async (doctorId) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
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
        throw new Error(errorData.message || 'Failed to fetch doctor');
      }

      const result = await response.json();
      return result.data; // Backend returns { success, data }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  };

  // Lấy bác sĩ theo chuyên khoa
  const getDoctorsBySpecialty = async (specialty) => {
    try {
      const response = await fetch(`${API_URL}/doctors/specialty/${specialty}`, {
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
        throw new Error('Failed to fetch doctors by specialty');
      }

      const result = await response.json();
      return result.data; // Backend returns { success, count, data }
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      throw error;
    }
  };

  // Lấy profile bác sĩ của chính mình
  const getMyDoctorProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors/my-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (response.status === 404) {
        return null; // Doctor profile not found
      }

      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching my doctor profile:', error);
      throw error;
    }
  };

  // Tạo bác sĩ mới
  const createDoctor = async (doctorData) => {
    try {
      const response = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create doctor');
      }

      const result = await response.json();
      await fetchAllDoctors();
      return result.data; // Backend returns { success, message, data }
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  };

  // Cập nhật bác sĩ
  const updateDoctor = async (doctorId, doctorData) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update doctor error:', errorData);
        throw new Error(errorData.message || 'Failed to update doctor');
      }

      const result = await response.json();
      await fetchAllDoctors();
      return result.data; // Backend returns { success, message, data }
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  };

  // Cập nhật lịch làm việc của bác sĩ
  const updateDoctorSchedule = async (doctorId, schedule) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${doctorId}/schedule`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule }),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update schedule');
      }

      const result = await response.json();
      await fetchAllDoctors();
      return result.data; // Backend returns { success, message, data }
    } catch (error) {
      console.error('Error updating doctor schedule:', error);
      throw error;
    }
  };

  // Xóa bác sĩ
  const deleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`${API_URL}/doctors/${doctorId}`, {
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
        throw new Error(errorData.message || 'Failed to delete doctor');
      }

      await fetchAllDoctors();
      return true;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        doctors,
        isLoading,
        fetchAllDoctors,
        getDoctorById,
        getDoctorsBySpecialty,
        getMyDoctorProfile,
        createDoctor,
        updateDoctor,
        updateDoctorSchedule,
        deleteDoctor,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
