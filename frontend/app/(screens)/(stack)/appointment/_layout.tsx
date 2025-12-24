import { Stack } from 'expo-router';
import React from 'react';

export default function AppointmentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="selectDoctor" options={{ title: 'Chọn bác sĩ' }} />
      <Stack.Screen name="bookAppointment" options={{ title: 'Đặt lịch khám' }} />
      <Stack.Screen name="myAppointments" options={{ title: 'Lịch hẹn của tôi' }} />
    </Stack>
  );
}
