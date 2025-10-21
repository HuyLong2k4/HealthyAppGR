import { Stack } from 'expo-router'
import React from 'react'

export default function _layoutStack() {
  return (
   <Stack
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
   </Stack>
  )
}