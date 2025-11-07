import { AuthProvider } from '@/context/AuthContext';
import { CourseProvider } from '@/context/CourseContext';
import { DailyGoalProvider } from '@/context/DailyGoalContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { HealthIndexProvider } from '@/context/HealthIndexContext';
import { LessonProvider } from '@/context/LessonContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

// 1. TẠO THEME TÙY CHỈNH CHO LIGHT MODE
const MyLightTheme = {
    ...DefaultTheme, // Bắt đầu bằng tất cả giá trị của DefaultTheme
    colors: {
        ...DefaultTheme.colors, // Kế thừa tất cả màu mặc định
        background: '#faf7f8ff', // Màu nền chính của các màn hình
        card: '#FFFFFF',        // Màu nền của header (thanh tiêu đề) và tab
        text: '#111111',        // Màu chữ chính
        primary: '#8e3338ff',   // Màu chính (dùng cho nút, link, v.v.)
    },
};

// 2. (Tùy chọn) TẠO THEME TÙY CHỈNH CHO DARK MODE
const MyDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#121212',
        card: '#1C1C1C',
        primary: '#BB86FC', 
    },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    // ... (phần useFonts, if (!loaded) ... )

    return (
        <AuthProvider>
            <DailyGoalProvider>
                <CourseProvider>
                    <EnrollmentProvider>
                        <LessonProvider>
                            <HealthIndexProvider>
                                <ThemeProvider 
                                    value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}
                                >
                                    <Stack>
                                        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
                                        <Stack.Screen name="+not-found" />
                                    </Stack>
                                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> 
                                </ThemeProvider>
                            </HealthIndexProvider>
                        </LessonProvider>
                    </EnrollmentProvider>
                </CourseProvider>
            </DailyGoalProvider>
        </AuthProvider>
    );
}