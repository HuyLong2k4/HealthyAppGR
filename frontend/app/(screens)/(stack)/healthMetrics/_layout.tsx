import { Stack } from "expo-router";
import React from "react";

export default function HealthMetricsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddHealthIndex" />
      <Stack.Screen name="HistoryHealthIndex" />
    </Stack>
  );
}
