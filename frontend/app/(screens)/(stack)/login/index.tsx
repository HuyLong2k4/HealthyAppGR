import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    
    const loginData = {
      email,
      password,
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      const result = await res.json();

      if (res.ok) {
        const { token, user } = result;
        
        console.log('Login response:', { token: !!token, user });
        console.log('User ID:', user?._id || user?.id);

        await login(token, user);

        if (user.role === 'ADMIN') {
          Alert.alert('Đăng nhập thành công! Đang chuyển hướng tới trang admin...');
          router.replace("/(screens)/(admin)/course/list");
        } else {
          Alert.alert('Đăng nhập thành công! Đang chuyển hướng...');
          router.push("/(screens)/(tabs)");
        }
      } else {
        Alert.alert("Đăng nhập thất bại", result.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
        console.error("API error:", error);
        Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.registerText} onPress={() => router.push("/(screens)/(stack)/register")} >Ấn vào đây để đăng ký</Text>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#c86f7cff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
    fontSize: 16,
  },
});
