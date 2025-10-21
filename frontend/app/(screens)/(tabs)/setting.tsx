import SettingItem from "@/components/tabs/SettingItem"
import { Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"

// import useAuth
import { useAuth } from "@/context/AuthContext"

const SettingPage = () => {
  const { user, logout } = useAuth()  // lấy user từ context

  return (
    <View style={styles.settingPages}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}> Thông tin cá nhân </Text>
      </View>

      {/* image */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.imageURL
              ? { uri: user.imageURL } // nếu user có avatar từ backend
              : require("../../../assets/images/avatar.png") // fallback avatar
          }
          style={styles.avatar}
        />
      </View>

      {/* Thông tin */}
      <View style={styles.authContainer}>
        <Text style={styles.authName}>{user?.username || "Chưa có tên"}</Text>
        <Text style={styles.authEmail}>{user?.email || "Chưa có email"}</Text>
      </View>

      {/* Chức năng */}
      <View style={styles.setupContainer}>
        <SettingItem
          icon={<Feather name="user" size={20} color="#333" />}
          text="Thông tin cá nhân"
          onPress={() => router.push("/(screens)/(stack)/setUpInfor")}
        />
        <SettingItem
          icon={<Feather name="message-circle" size={20} color="#333" />}
          text="FAQ"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Feather name="help-circle" size={20} color="#333" />}
          text="Trợ giúp"
          onPress={() => {}}
        />
        <SettingItem
          icon={<Feather name="power" size={20} color="red" />}
          text="Đăng xuất"
          color="red"
          onPress={() => {
            logout() // xoá user trong context + AsyncStorage
            router.replace("/(screens)/(stack)/login") // quay về login
          }}
        />
      </View>
    </View>
  )
}

export default SettingPage

const styles = StyleSheet.create({
  settingPages:{
    flex: 1,
    backgroundColor: "#fff"
  },

  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    
  },

  titleText: {
    fontSize: 20,
    fontWeight: "600",
  },
  avatarContainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    marginTop: 20,
    borderRadius: 60,
    width: 120,
    height: 120,
    resizeMode: "cover",
  },

  authContainer: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  authName: {
    fontSize: 16,
    fontWeight: "500",
  },

  authEmail: {
    color: "gray",
  },

  setupContainer: {
    margin: 40,
    borderRadius: 5,
  },
})
