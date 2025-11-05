import { CategoryColors, CategoryIcons, UnitLabels } from '@/constants/DailyGoalConstants';
import { GoalStatus, useDailyGoal } from '@/context/DailyGoalContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface DailyGoal {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  targetDate: string;
  status: string;
  category?: string;
}

// Hàm tính toán tuần hiện tại
const getCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return { monday, sunday };
};

// Hàm tạo mảng các ngày trong tuần
const getWeekDays = (startDate: Date) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  return days;
};

// Hàm format ngày
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const WeeklyGoals = () => {
  const { dailyGoals, getGoalsForWeek, updateGoalStatus, isLoading } = useDailyGoal();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonday, setCurrentMonday] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  const loadWeekGoals = useCallback((monday: Date) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    setWeekDays(getWeekDays(monday));
    
    // Load goals cho tuần
    const startDate = formatDate(monday);
    const endDate = formatDate(sunday);
    getGoalsForWeek(startDate, endDate);
  }, [getGoalsForWeek]);

  useEffect(() => {
    const week = getCurrentWeek();
    setCurrentMonday(week.monday);
    setSelectedDate(new Date());
    loadWeekGoals(week.monday);
  }, [loadWeekGoals]);

  // Chuyển sang tuần trước
  const goToPreviousWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() - 7);
    setCurrentMonday(newMonday);
    loadWeekGoals(newMonday);
  };

  // Chuyển sang tuần sau
  const goToNextWeek = () => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + 7);
    setCurrentMonday(newMonday);
    loadWeekGoals(newMonday);
  };

  // Quay về tuần hiện tại
  const goToCurrentWeek = () => {
    const week = getCurrentWeek();
    setCurrentMonday(week.monday);
    setSelectedDate(new Date());
    loadWeekGoals(week.monday);
  };

  // Lọc goals theo ngày được chọn
  const getGoalsForSelectedDate = () => {
    const selectedDateStr = formatDate(selectedDate);
    return (dailyGoals as DailyGoal[]).filter((goal: DailyGoal) => {
      const goalDate = new Date(goal.targetDate).toISOString().split('T')[0];
      return goalDate === selectedDateStr;
    });
  };

  const toggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const newStatus = currentStatus === GoalStatus.COMPLETED ? GoalStatus.OPEN : GoalStatus.COMPLETED;
    await updateGoalStatus(goalId, newStatus);
  };

  // Kiểm tra xem ngày có phải hôm nay không
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Kiểm tra xem ngày có được chọn không
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Đếm số goals đã hoàn thành trong ngày
  const getCompletedGoalsCount = (date: Date) => {
    const dateStr = formatDate(date);
    const goalsForDate = (dailyGoals as DailyGoal[]).filter((goal: DailyGoal) => {
      const goalDate = new Date(goal.targetDate).toISOString().split('T')[0];
      return goalDate === dateStr && goal.status === GoalStatus.COMPLETED;
    });
    return goalsForDate.length;
  };

  // Đếm tổng số goals trong ngày
  const getTotalGoalsCount = (date: Date) => {
    const dateStr = formatDate(date);
    const goalsForDate = (dailyGoals as DailyGoal[]).filter((goal: DailyGoal) => {
      const goalDate = new Date(goal.targetDate).toISOString().split('T')[0];
      return goalDate === dateStr;
    });
    return goalsForDate.length;
  };

  const renderDayItem = (date: Date, index: number) => {
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const completed = getCompletedGoalsCount(date);
    const total = getTotalGoalsCount(date);
    const allCompleted = total > 0 && completed === total;

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayItem}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={styles.dayName}>{dayNames[date.getDay()]}</Text>
        <View style={[
          styles.dateCircle,
          isToday(date) && styles.todayCircle,
          isSelected(date) && styles.selectedCircle,
          allCompleted && styles.completedCircle,
        ]}>
          {allCompleted ? (
            <Ionicons name="checkmark" size={20} color="#fff" />
          ) : (
            <Text style={[
              styles.dateText,
              (isToday(date) || isSelected(date) || allCompleted) && styles.dateTextWhite
            ]}>
              {date.getDate()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedGoals = getGoalsForSelectedDate();

  // Kiểm tra xem có phải tuần hiện tại không
  const isCurrentWeek = () => {
    const currentWeekMonday = getCurrentWeek().monday;
    return formatDate(currentMonday) === formatDate(currentWeekMonday);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Mục tiêu hôm nay</Text>
      </View>

      {/* Calendar Header with Navigation */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#4285F4" />
        </TouchableOpacity>
        
        <View style={styles.monthYearContainer}>
          <Text style={styles.monthYear}>
            Tháng {currentMonday.getMonth() + 1}, {currentMonday.getFullYear()}
          </Text>
          {!isCurrentWeek() && (
            <TouchableOpacity onPress={goToCurrentWeek} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Hôm nay</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#4285F4" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => renderDayItem(day, index))}
      </View>

      {/* Goals List */}
      <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4285F4" style={styles.loader} />
      ) : (
        <ScrollView style={styles.goalsList}>
          {selectedGoals.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có mục tiêu cho ngày này</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push({
                  pathname: "/(screens)/(stack)/setTarget/AddTargetNew" as any,
                  params: { date: formatDate(selectedDate) }
                })}
              >
                <Text style={styles.addButtonText}>Thêm mục tiêu mới</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedGoals.map((goal: DailyGoal, index: number) => {
              const category = goal.category || 'CUSTOM';
              const iconName = CategoryIcons[category as keyof typeof CategoryIcons] || 'create';
              const iconColor = CategoryColors[category as keyof typeof CategoryColors] || '#607D8B';
              const unitLabel = UnitLabels[goal.unit as keyof typeof UnitLabels] || goal.unit;
              
              return (
                <View key={goal._id || index} style={styles.goalItem}>
                  <View style={[styles.goalIcon, { backgroundColor: iconColor + '20' }]}>
                    <Ionicons name={iconName as any} size={24} color={iconColor} />
                  </View>
                  <View style={styles.goalContent}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalQuantity}>
                      {goal.quantity} {unitLabel}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleGoalStatus(goal._id, goal.status)}
                    style={styles.checkButton}
                  >
                    <View style={[
                      styles.checkbox,
                      goal.status === GoalStatus.COMPLETED && styles.checkboxCompleted
                    ]}>
                      {goal.status === GoalStatus.COMPLETED && (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Add New Goal Button - Fixed at bottom */}
      {selectedGoals.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => router.push({
            pathname: "/(screens)/(stack)/setTarget/AddTargetNew" as any,
            params: { date: formatDate(selectedDate) }
          })}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WeeklyGoals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
  },
  calendarHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    padding: 8,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  todayButton: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 12,
    color: "#4285F4",
    fontWeight: "500",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dayItem: {
    alignItems: "center",
    gap: 8,
  },
  dayName: {
    fontSize: 12,
    color: "#666",
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: {
    backgroundColor: "#2196F3",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  selectedCircle: {
    backgroundColor: "#00BCD4",
  },
  completedCircle: {
    backgroundColor: "#4CAF50",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateTextWhite: {
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: "#000",
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  goalContent: {
    flex: 1,
    marginLeft: 12,
  },
  goalName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  goalQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  checkButton: {
    padding: 5,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  loader: {
    marginTop: 50,
  },
});
