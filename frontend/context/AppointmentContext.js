import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AppointmentProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tất cả appointments (Admin)
  const fetchAllAppointments = async (filters = {}) => {
    try {
      setIsLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.specialty) queryParams.append('specialty', filters.specialty);
      if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
      if (filters.patientId) queryParams.append('patientId', filters.patientId);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/appointments${queryString ? `?${queryString}` : ''}`;
      
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
        throw new Error('Failed to fetch appointments');
      }

      const result = await response.json();
      const data = result.data || [];
      setAppointments(data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout: Failed to fetch appointments');
      } else {
        console.error('Error fetching appointments:', error);
      }
      setAppointments([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy appointments của patient hiện tại
  const getMyAppointments = async (filters = {}) => {
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/appointments/my-appointments${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
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
        throw new Error('Failed to fetch my appointments');
      }

      const result = await response.json();
      const data = result.data || [];
      setAppointments(data);
      return data;
    } catch (error) {
      console.error('Error fetching my appointments:', error);
      setAppointments([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy appointments của doctor hiện tại
  const getDoctorAppointments = async (doctorId, filters = {}) => {
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/appointments/doctor/${doctorId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
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
        throw new Error('Failed to fetch doctor appointments');
      }

      const result = await response.json();
      const data = result.data || [];
      setAppointments(data);
      return data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      setAppointments([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thông tin appointment theo ID
  const getAppointmentById = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
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
        throw new Error(errorData.message || 'Failed to fetch appointment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  };

  // Tạo appointment mới
  const createAppointment = async (appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.status === 401) {
        await logout();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json();
        // Throw error message từ backend
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Throw lại với message, không phải error object
      throw new Error(error.message || 'Failed to create appointment');
    }
  };

  // Cập nhật appointment
  const updateAppointment = async (appointmentId, appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  // Cập nhật status của appointment
  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        await logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };

  // Hủy appointment
  const cancelAppointment = async (appointmentId, reason) => {
    try {
      // Backend không có endpoint /cancel riêng
      // Dùng updateAppointmentStatus để set status = CANCELLED
      return await updateAppointmentStatus(appointmentId, 'CANCELLED');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  };

  // Xóa appointment (Admin only)
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
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
        throw new Error(errorData.message || 'Failed to delete appointment');
      }

      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  // Lấy appointments của bệnh nhân theo patientId
  const getAppointmentsByPatient = async (patientId) => {
    try {
      const response = await fetch(`${API_URL}/appointments/patient/${patientId}`, {
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
        throw new Error('Failed to fetch patient appointments');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  };

  // Lấy thống kê appointments
  const getAppointmentStats = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
      if (filters.patientId) queryParams.append('patientId', filters.patientId);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/appointments/stats${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
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
        throw new Error('Failed to fetch appointment stats');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        fetchAllAppointments,
        getMyAppointments,
        getDoctorAppointments,
        getAppointmentById,
        getAppointmentsByPatient,
        createAppointment,
        updateAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        deleteAppointment,
        getAppointmentStats,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
