import Feature from "@/components/stacks/Feature"
import StatBox from "@/components/stacks/StatBox"
import { CategoryColors, CategoryIcons, UnitLabels } from "@/constants/DailyGoalConstants"
import { useCourse } from "@/context/CourseContext"
import { GoalStatus, useDailyGoal } from "@/context/DailyGoalContext"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

// Hàm lấy ngày hôm nay
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Hàm tính toán tuần hiện tại
const getCurrentWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return { 
    monday: monday.toISOString().split('T')[0], 
    sunday: sunday.toISOString().split('T')[0] 
  };
};

const HomeScreen = () => {
  const { refreshCourses } = useCourse();
  const { dailyGoals, getGoalsForWeek, updateGoalStatus } = useDailyGoal();
  const [todayGoals, setTodayGoals] = useState<any[]>([]);

  const loadTodayGoals = useCallback(async () => {
    const week = getCurrentWeek();
    await getGoalsForWeek(week.monday, week.sunday);
  }, [getGoalsForWeek]);

  useEffect(() => {
    refreshCourses();
    loadTodayGoals();
  }, [refreshCourses, loadTodayGoals]);

  useEffect(() => {
    // Filter goals for today
    const today = getTodayString();
    const goals = (dailyGoals as any[]).filter((goal: any) => {
      const goalDate = new Date(goal.targetDate).toISOString().split('T')[0];
      return goalDate === today;
    });
    setTodayGoals(goals);
  }, [dailyGoals]);

  const handleGoalToggle = async (goalId: string, currentStatus: string) => {
    await updateGoalStatus(goalId, currentStatus === 'COMPLETED' ? 'OPEN' : 'COMPLETED');
  };

  const handleViewAllGoals = () => {
    router.push("/(screens)/(stack)/setTarget/WeeklyGoals" as any);
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.bannerContainer}>
  <Image
    source={require("../../../assets/images/banner1.jpg")}
    style={styles.bannerImage}
  />
  <View style={styles.bannerOverlay}>
    <Text style={styles.bannerText}>Chào mừng bạn trở lại!</Text>
  </View>
</View>
<View style={styles.body}>
  {/* Tính năng chính */}
      <Text style={styles.sectionTitle}>Tính năng chính</Text>
      <View style={styles.features}>
        <TouchableOpacity>
          <Feature icon="list" text="Chươngtrình" nameScreen="category"/>
        </TouchableOpacity>
        <Feature icon="user-friends" text="Theo dõiSK" nameScreen="category"/>
        <Feature icon="book" text="Nhật kí" nameScreen="category"/>
        <Feature icon="lightbulb" text="Cẩm nang" nameScreen="category"/>
      </View>
       {/* Thiết lập mục tiêu tuần */}
      <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
      
      {todayGoals.length === 0 ? (
        <View style={styles.weekGoal}>
          <Text style={styles.weekGoalText}>
            Bạn chưa thiết lập mục tiêu cho hôm nay. Hãy thiết lập ngay!
          </Text>
          <TouchableOpacity 
            style={styles.goalButton} 
            onPress={handleViewAllGoals}
          >
            <Text style={styles.goalButtonText}>Thiết lập ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.goalsContainer}>
          <View style={styles.goalsHeader}>
            <Text style={styles.goalsTitle}>Mục tiêu hôm nay</Text>
            <TouchableOpacity onPress={handleViewAllGoals}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {todayGoals.slice(0, 3).map((goal: any) => {
            const category = goal.category || 'CUSTOM';
            const iconName = CategoryIcons[category as keyof typeof CategoryIcons] || 'create';
            const iconColor = CategoryColors[category as keyof typeof CategoryColors] || '#607D8B';
            const unitLabel = UnitLabels[goal.unit as keyof typeof UnitLabels] || goal.unit;
            const isCompleted = goal.status === GoalStatus.COMPLETED;

            return (
              <View key={goal._id} style={styles.goalItem}>
                <View style={[styles.goalIconContainer, { backgroundColor: iconColor + '20' }]}>
                  <Ionicons name={iconName as any} size={20} color={iconColor} />
                </View>
                <View style={styles.goalContent}>
                  <Text style={[styles.goalName, isCompleted && styles.completedText]}>
                    {goal.name}
                  </Text>
                  <Text style={styles.goalQuantity}>
                    {goal.quantity} {unitLabel}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleGoalToggle(goal._id, goal.status)}
                  style={styles.checkButton}
                >
                  <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
                    {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* Chỉ số sức khỏe */}
      <Text style={styles.sectionTitle}>Chỉ số sức khỏe</Text>
      <View style={styles.healthStats}>
        <StatBox iconName="thermometer" label="Nhiệt độ cơ thể" value="84" unit="ºC" color="#FF9F43" />
        <StatBox iconName="heart" label="Nhịp tim" value="70" unit="BPM" color="#FF6B81" />
        <StatBox iconName="droplet" label="Độ bão hòa Oxi" value="84" unit="mmHg" color="#2986ff"/>
        <StatBox iconName="activity" label="Tần số hô hấp" value="155" unit="mg/dL" color="#34C759" />
        <StatBox iconName="github" label="Giấc ngủ" value="8" unit="H" color="#00C7BE" />
        <StatBox iconName="github" label="Số bước chân" value="155" unit="steps" color="#9D00FF" />
        {/* Thêm các chỉ số khác ở đây */}
      </View>
</View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  bannerContainer: {
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    marginTop: 35,
    height: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  container: {
    backgroundColor: "#F5F7FA",
  },
  body: {
    margin: 20,
    paddingBottom: "20%"
  },
  sectionTitle: {
    marginTop: 35,
    marginBottom: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    paddingLeft: 5,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  weekGoal: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  weekGoalText: {
    textAlign: "center",
    marginBottom: 15,
    color: "#4A5568",
    fontSize: 15,
    lineHeight: 22,
  },
  goalButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    margin: 20,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  goalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  healthStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    gap: 12,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  goalsContainer: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  goalsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4285F4",
    fontWeight: "500",
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  goalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  goalQuantity: {
    fontSize: 13,
    color: "#666",
  },
  checkButton: {
    padding: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
})

export default HomeScreen
