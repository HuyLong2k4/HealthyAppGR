import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone]       = useState("");
  const [gender, setGender]     = useState("OTHER");
  const [dob, setDob]           = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Tên đăng nhập, Email và Mật khẩu");
      return;
    }

    const userData = { username, email, password, phone, gender, dob };

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await res.json();

      if (res.status === 201) {
        Alert.alert("Thành công", `Người dùng "${result.user.username}" đã được tạo!`);
        router.push("/(screens)/(tabs)");
      } else {
        Alert.alert("Đăng ký thất bại", result.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.error("API error:", error);
      Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại (không bắt buộc)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Chọn ngày sinh */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.datePickerText}>
          Ngày sinh: {dob.toLocaleDateString("vi-VN")}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}

      {/* Chọn giới tính */}
      <View style={styles.genderContainer}>
        {["MALE", "FEMALE", "OTHER"].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderButton,
              gender === g && styles.genderButtonSelected,
            ]}
            onPress={() => setGender(g)}
          >
            <Text
              style={[
                styles.genderText,
                gender === g && styles.genderTextSelected,
              ]}
            >
              {g === "MALE" ? "Nam" : g === "FEMALE" ? "Nữ" : "Khác"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
  genderContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  genderButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, flex: 1, marginHorizontal: 5 },
  genderButtonSelected: { backgroundColor: "#007bff", borderColor: "#007bff" },
  genderText: { textAlign: "center", color: "#333" },
  genderTextSelected: { color: "#fff", fontWeight: "bold" },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  datePickerText: { fontSize: 16, color: "#333" },
});
