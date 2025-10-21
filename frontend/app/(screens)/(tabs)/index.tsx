import Feature from "@/components/stacks/Feature"
import StatBox from "@/components/stacks/StatBox"
import { router } from "expo-router"
import React from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const HomeScreen = () => {
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
        <Feature size={20} icon="list" text="Chươngtrình" nameScreen="category"/>
        <Feature icon="user-friends" text="Theo dõiSK" nameScreen="category"/>
        <Feature icon="book" text="Nhật kí" nameScreen="category"/>
        <Feature icon="lightbulb" text="Cẩm nang" nameScreen="category"/>
      </View>
       {/* Thiết lập mục tiêu tuần */}
      <Text style={styles.sectionTitle}>Thiết lập mục tiêu tuần</Text>
      <View style={styles.weekGoal}>
        <Text style={styles.weekGoalText}>Bạn chưa thiết lập mục tiêu cho tuần này. Hãy thiết lập ngay !</Text>
        <TouchableOpacity style={styles.goalButton}>
          <Text style={styles.goalButtonText} onPress={() => router.push("/(screens)/(stack)/setTarget")}>Thiết lập ngay</Text>
        </TouchableOpacity>
      </View>

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
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  overflow: "hidden",
  marginTop: 35,
  height: 200,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 10,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
},
bannerText: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "bold",
},
  container: {
    backgroundColor: "#fff",
  },
  body: {
    margin: 40,
    paddingBottom: "20%"
  },
  sectionTitle: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: "bold",
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 36,
  },
  weekGoal: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#4285F4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  weekGoalText: {
    textAlign: "center",
    marginBottom: 10,
  },
  goalButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    margin: 30
  },
  goalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  healthStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    gap: 10,
  },
})

export default HomeScreen
