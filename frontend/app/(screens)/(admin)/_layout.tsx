import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="user/list" options={{ title: 'Quản lý người dùng' }} />
      <Stack.Screen name="doctor/list" options={{ title: 'Quản lý bác sĩ' }} />
      <Stack.Screen name="doctor/update" options={{ title: 'Cập nhật bác sĩ' }} />
      <Stack.Screen name="course/list" options={{ title: 'Quản lý khóa học' }} />
      <Stack.Screen name="course/create" options={{ title: 'Tạo khóa học' }} />
      <Stack.Screen name="course/update" options={{ title: 'Cập nhật khóa học' }} />
      <Stack.Screen name="lesson/list" options={{ title: 'Quản lý bài học' }} />
      <Stack.Screen name="lesson/create" options={{ title: 'Tạo bài học' }} />
      <Stack.Screen name="lesson/detailList" options={{ title: 'Chi tiết bài học' }} />
    </Stack>
  );
}
