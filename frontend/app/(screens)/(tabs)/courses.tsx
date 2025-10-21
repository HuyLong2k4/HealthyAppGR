import ProgramCard from "@/components/stacks/ProgramCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CategoryPage = () => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Chương trình sức khỏe</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Đã tham gia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Đã hoàn thành</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.cardList}>
        <ProgramCard
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjFkyP9-RVGlhYnrFKvLgPJOjZYe-eOta7hA&s"
          title="Dinh dưỡng"
          description="Dinh dưỡng là quá trình cung cấp và sử dụng các chất dinh dưỡng cần thiết cho cơ thể..."
          status="Đã tham gia"
          completed={10}
          currentWeek={2}
          totalWeek={12}
          actionText="Học tiếp"
          statusColor="#2F80ED"
          onPress={() => router.push('/programDetail?title=Dinh dưỡng')}
        />
        <ProgramCard
          image="data:image/jpeg;base64,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"
          title="Tập luyện thể dục"
          description="Tập luyện thể dục là các hoạt động vận động cơ thể nhằm nâng cao sức khỏe thể chất..."
          status="Đã hoàn thành"
          completed={100}
          currentWeek={12}
          totalWeek={12}
          actionText="Xem lại"
          statusColor="#27AE60"
          onPress={() => router.push('/programDetail?title=Tập luyện thể dục')}
        />
      </ScrollView>
    </View>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: "20%"
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#E3EEFD",
  },
  tabText: {
    fontSize: 8,
    color: "#333",
  },
  activeTabText: {
    color: "#2F80ED",
    fontWeight: "600",
  },
  cardList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    height: 160,
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  statusTag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2F80ED",
  },
  progressText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  cardButton: {
    backgroundColor: "#2F80ED",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
