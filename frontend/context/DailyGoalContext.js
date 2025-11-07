import { createContext, useCallback, useContext, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Goal Status ---
export const GoalStatus = {
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
};

// --- Goal Categories ---
export const GoalCategory = {
  HYDRATION: 'HYDRATION',
  RUNNING: 'RUNNING',
  WALKING: 'WALKING',
  CYCLING: 'CYCLING',
  SWIMMING: 'SWIMMING',
  SLEEP: 'SLEEP',
  CUSTOM: 'CUSTOM',
};

// --- Goal Units ---
export const GoalUnit = {
  CUP: 'CUP',
  ML: 'ML',
  KM: 'KM',
  MIN: 'MIN',
  STEP: 'STEP',
  TIMES: 'TIMES',
};

// --- Tạo Context ---
const DailyGoalContext = createContext();

/**
 * Xử lý lỗi response một cách an toàn
 * Cố gắng parse lỗi JSON, nếu thất bại, trả về text.
 */
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

export const DailyGoalProvider = ({ children }) => {
  const [dailyGoals, setDailyGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  /**
   * Tạo mục tiêu hàng ngày mới
   */
  const createDailyGoal = useCallback(async (goalData) => {
    if (!token) {
      Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
      return false;
    }

    const { targetDate, name, quantity, unit } = goalData;

    if (!targetDate || !name || !quantity || !unit) {
      Alert.alert("Lỗi", "Thiếu thông tin bắt buộc");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/daily-goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        const errorMsg = await getErrorFromResponse(response);
        throw new Error(errorMsg || 'Tạo mục tiêu thất bại.');
      }

      const newGoal = await response.json();
      setDailyGoals(prevGoals => [...prevGoals, newGoal]);
      Alert.alert("Thành công", "Mục tiêu đã được tạo.");
      return true;

    } catch (error) {
      console.error("Lỗi khi tạo mục tiêu:", error);
      Alert.alert("Lỗi", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Lấy danh sách mục tiêu theo tuần
   */
  const getGoalsForWeek = useCallback(async (startDate, endDate) => {
    if (!token) return;

    if (!startDate || !endDate) {
      Alert.alert("Lỗi", "startDate và endDate là bắt buộc");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/daily-goals/week?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMsg = await getErrorFromResponse(response);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setDailyGoals(data);
      return data;

    } catch (error) {
      console.error("Lỗi khi tải danh sách mục tiêu:", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Cập nhật trạng thái mục tiêu
   */
  const updateGoalStatus = useCallback(async (goalId, status) => {
    if (!token) {
      Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
      return false;
    }

    if (!status || !Object.values(GoalStatus).includes(status)) {
      Alert.alert("Lỗi", "Trạng thái không hợp lệ");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/daily-goals/${goalId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorMsg = await getErrorFromResponse(response);
        throw new Error(errorMsg || 'Cập nhật trạng thái thất bại.');
      }

      const updatedGoal = await response.json();
      setDailyGoals(prevGoals =>
        prevGoals.map(g => g._id === goalId ? updatedGoal : g)
      );
      Alert.alert("Thành công", "Trạng thái đã được cập nhật.");
      return true;

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      Alert.alert("Lỗi", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Xóa mục tiêu
   */
  const deleteGoal = useCallback(async (goalId) => {
    if (!token) {
      Alert.alert("Lỗi", "Yêu cầu đăng nhập.");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/daily-goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMsg = await getErrorFromResponse(response);
        throw new Error(errorMsg || 'Xóa mục tiêu thất bại.');
      }

      setDailyGoals(prevGoals => prevGoals.filter(g => g._id !== goalId));
      Alert.alert("Thành công", "Mục tiêu đã được xóa.");
      return true;

    } catch (error) {
      console.error("Lỗi khi xóa mục tiêu:", error);
      Alert.alert("Lỗi", error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Refresh danh sách mục tiêu hiện tại
   */
  const refreshDailyGoals = useCallback(async (startDate, endDate) => {
    if (startDate && endDate) {
      await getGoalsForWeek(startDate, endDate);
    }
  }, [getGoalsForWeek]);

  const value = {
    dailyGoals,
    isLoading,
    createDailyGoal,
    getGoalsForWeek,
    updateGoalStatus,
    deleteGoal,
    refreshDailyGoals,
  };

  return (
    <DailyGoalContext.Provider value={value}>
      {children}
    </DailyGoalContext.Provider>
  );
};

export const useDailyGoal = () => useContext(DailyGoalContext);
