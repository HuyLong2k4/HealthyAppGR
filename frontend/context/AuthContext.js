import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser && savedToken) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Lỗi khi load user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Hàm login: gọi API backend để check tài khoản
  const login = async (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    await SecureStore.setItemAsync("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("token");
    await AsyncStorage.removeItem("user");
  };

  const updateUser = async (updateData) => {
    const newUser = { ...user, ...updateData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
