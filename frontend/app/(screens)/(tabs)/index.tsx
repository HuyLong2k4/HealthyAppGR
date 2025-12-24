import StatBox from "@/components/stacks/StatBox"
import { CategoryColors, CategoryIcons, UnitLabels } from "@/constants/DailyGoalConstants"
import { HealthIndexType, getHealthIndexConfig } from "@/constants/HealthIndexConstants"
import { useCourse } from "@/context/CourseContext"
import { GoalStatus, useDailyGoal } from "@/context/DailyGoalContext"
import { useHealthIndexes } from "@/context/HealthIndexContext"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
  const { healthIndexes, refreshHealthIndexes } = useHealthIndexes();
  const { refreshCourses } = useCourse();
  const { dailyGoals, getGoalsForWeek, updateGoalStatus } = useDailyGoal();
  const [todayGoals, setTodayGoals] = useState<any[]>([]);


  const loadTodayGoals = useCallback(async () => {
    const week = getCurrentWeek();
    await getGoalsForWeek(week.monday, week.sunday);
  }, [getGoalsForWeek]);

  // Refresh data mỗi khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      refreshHealthIndexes();
      refreshCourses();
      loadTodayGoals();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty deps - chạy mỗi khi focus, ignore warning
  );

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
    <>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.4)" translucent />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.bannerContainer}>
        <Image
          source={require("../../../assets/images/banner1.jpg")}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.greetingText}>Xin chào!</Text>
          <Text style={styles.bannerText}>Chúc bạn một ngày tốt lành</Text>
        </View>
      </View>
<View style={styles.body}>
  {/* Tính năng chính */}
      <Text style={styles.sectionTitle}>Tính năng chính</Text>
      <View style={styles.features}>
        <TouchableOpacity onPress={() => router.push('/(screens)/(stack)/chat/message')} style={styles.featureCard}>
          <LinearGradient colors={['#183cd9ff', '#183cd9ff']} style={styles.featureIconContainer}>
            <FontAwesome5 name="comments" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.featureText}>Chat với AI</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(screens)/(stack)/appointment/selectDoctor')} style={styles.featureCard}>
          <LinearGradient colors={['#f5576c', '#f5576c']} style={styles.featureIconContainer}>
            <FontAwesome5 name="user-friends" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.featureText}>Đặt lịch khám</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(screens)/(stack)/appointment/myAppointments')} style={styles.featureCard}>
          <LinearGradient colors={['#00f2fe', '#00f2fe']} style={styles.featureIconContainer}>
            <FontAwesome5 name="book" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.featureText}>Lịch hẹn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(screens)/(stack)/notification')} style={styles.featureCard}>
          <LinearGradient colors={['#fa709a', '#fa709a']} style={styles.featureIconContainer}>
            <FontAwesome5 name="bell" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.featureText}>Thông báo</Text>
        </TouchableOpacity>
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chỉ số sức khỏe</Text>
        {healthIndexes && healthIndexes.length > 0 && (
          <TouchableOpacity onPress={() => router.push("/(screens)/(stack)/healthMetrics/HistoryHealthIndex" as any)}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>
      {healthIndexes && healthIndexes.length > 0 ? (
        <View style={styles.healthStats}>
          {healthIndexes
            .sort((a: any, b: any) => {
              // Sort theo recordedTime tăng dần (cũ → mới)
              const timeA = new Date(a.recordedTime || a.createdAt).getTime();
              const timeB = new Date(b.recordedTime || b.createdAt).getTime();
              return timeA - timeB;
            })
            .slice(-1) // Lấy phần tử cuối cùng (mới nhất)
            .map((healthIndex: any, idx: number) => {
            // Convert backend fields to display format
            const metrics = [];
            
            if (healthIndex.bodyTemperature) {
              const config = getHealthIndexConfig(HealthIndexType.BODY_TEMPERATURE);
              metrics.push({
                type: HealthIndexType.BODY_TEMPERATURE,
                icon: config.icon,
                label: config.label,
                value: healthIndex.bodyTemperature.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            if (healthIndex.heartRate) {
              const config = getHealthIndexConfig(HealthIndexType.HEART_RATE);
              metrics.push({
                type: HealthIndexType.HEART_RATE,
                icon: config.icon,
                label: config.label,
                value: healthIndex.heartRate.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            if (healthIndex.oxygenSaturation) {
              const config = getHealthIndexConfig(HealthIndexType.OXYGEN_SATURATION);
              metrics.push({
                type: HealthIndexType.OXYGEN_SATURATION,
                icon: config.icon,
                label: config.label,
                value: healthIndex.oxygenSaturation.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            if (healthIndex.respiratoryRate) {
              const config = getHealthIndexConfig(HealthIndexType.RESPIRATORY_RATE);
              metrics.push({
                type: HealthIndexType.RESPIRATORY_RATE,
                icon: config.icon,
                label: config.label,
                value: healthIndex.respiratoryRate.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            if (healthIndex.sleep) {
              const config = getHealthIndexConfig(HealthIndexType.SLEEP);
              metrics.push({
                type: HealthIndexType.SLEEP,
                icon: config.icon,
                label: config.label,
                value: healthIndex.sleep.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            if (healthIndex.stepCount) {
              const config = getHealthIndexConfig(HealthIndexType.STEP_COUNT);
              metrics.push({
                type: HealthIndexType.STEP_COUNT,
                icon: config.icon,
                label: config.label,
                value: healthIndex.stepCount.toString(),
                unit: config.unit,
                color: config.color
              });
            }
            
            return metrics.map((metric, index) => (
              <StatBox 
                key={`${idx}-${index}`}
                iconName={metric.icon} 
                label={metric.label} 
                value={metric.value} 
                unit={metric.unit} 
                color={metric.color}
                onPress={() => router.push({
                  pathname: "/(screens)/(stack)/healthMetrics/DetailHealthIndex" as any,
                  params: { type: metric.type }
                })}
              />
            ));
          })}
        </View>
      ) : (
        <View style={styles.weekGoal}>
          <Ionicons name="fitness-outline" size={48} color="#ccc" />
          <Text style={styles.weekGoalText}>
            Bạn chưa có chỉ số sức khỏe. Hãy nhập chỉ số để theo dõi!
          </Text>
          <TouchableOpacity 
            style={styles.goalButton}
            onPress={() => router.push("/(screens)/(stack)/healthMetrics/AddHealthIndex" as any)}
          >
            <Text style={styles.goalButtonText}>Nhập chỉ số</Text>
          </TouchableOpacity>
        </View>
      )}
</View>
    </ScrollView>
    </>
  )
}


const styles = StyleSheet.create({
  bannerContainer: {
    position: "relative",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: "hidden",
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  greetingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  container: {
    backgroundColor: "#f8fafc",
  },
  body: {
    margin: 20,
    paddingBottom: "20%"
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 15,
    paddingLeft: 5,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    letterSpacing: 0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: "#4facfe",
    fontWeight: "600",
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  weekGoal: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 0,
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  weekGoalText: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },
  goalButton: {
    backgroundColor: "#4facfe",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  healthStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  goalsContainer: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    color: "#1e293b",
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  goalContent: {
    flex: 1,
  },
  goalName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  goalQuantity: {
    fontSize: 13,
    color: "#64748b",
  },
  checkButton: {
    padding: 5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
})

export default HomeScreen
