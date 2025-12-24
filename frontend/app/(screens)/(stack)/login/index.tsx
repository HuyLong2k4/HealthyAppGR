import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
          router.replace('/(screens)/(admin)' as any);
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
    <LinearGradient
      colors={['#1034d5ff', '#92869fff', '#1034d5ff']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="fitness" size={60} color="#fff" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

          {/* Email Input */}
          <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
            <Ionicons name="mail-outline" size={20} color={emailFocused ? '#667eea' : '#999'} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
            <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? '#667eea' : '#999'} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#764ba2', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerPrompt}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/(screens)/(stack)/register")}>
              <Text style={styles.registerText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#667eea',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerPrompt: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  registerText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
