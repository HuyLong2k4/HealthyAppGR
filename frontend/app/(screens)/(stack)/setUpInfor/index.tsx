import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const SetupInfor = () => {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [ loading, setLoading ] = useState(false)
  const [showPicker, setShowPicker] = useState(false);

  const [ username, setUsername ] = useState(user?.username || "")
  const [ phone, setPhone ] = useState(user?.phone || "")
  const [ dob, setDob ] = useState(user?.dob ? new Date(user.dob) : new Date());


  const handleSave = async () => {

    setLoading(true)
    const updateData = {
      username,
      phone,
      dob: dob.toISOString(),
    }

    try {
      const res = await fetch(`http://192.168.0.229:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Không thể cập nhật thông tin.")
      }

      const updatedUserFromServer = await res.json();

      await updateUser(updatedUserFromServer)
      Alert.alert("Thành công", "Thông tin của bạn đã được cập nhật.")
      router.back()
    } catch(error) {
      console.error("Lỗi khi cập nhật:", error)
      Alert.alert("Lỗi")
    } finally {
      setLoading(false) // Dừng loading dù thành công hay thất bại
    }
  }

  const onDateChange = (event: any, selectedDate: React.SetStateAction<Date>) => {
    // Với Android, cần ẩn picker đi theo cách này
    if (Platform.OS === 'android') {
        setShowPicker(false);
    }
    // Chỉ cập nhật nếu người dùng đã chọn một ngày (không phải bấm cancel)
    if (selectedDate) {
        setDob(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back + Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa thông tin cá nhân</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={ user?.imageURL ? { uri: user.imageURL } : require("../../../../assets/images/avatar.png") }
        />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View>
            <Text>Họ và Tên</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Nhập họ và tên" />
        </View>
        <View>
            <Text>Số điện thoại</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Nhập số điện thoại" keyboardType="phone-pad" />
        </View>
        <View>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.datePickerText}>
                {dob.toLocaleDateString("vi-VN")}
              </Text>
            </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display={"default"}
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSave}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Lưu lại</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default SetupInfor

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
  email: {
    color: "gray",
  },
  form: {
    marginTop: 40,
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333'
  },
  input: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16, 
    color: "#333" 
  },
})
