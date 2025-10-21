import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const Feature = ({ icon, text, nameScreen }: { icon: any; text: string; nameScreen: string }) => {
  return (
    <TouchableOpacity onPress={() => router.push(`/(screens)/(tabs)/${nameScreen}`)} style={{ alignItems: "center" }}>
        <FontAwesome5 name={icon} size={30} color="#4285F4" />
        <Text style={{ fontSize: 12, marginTop: 5, marginBottom: 10 ,textAlign: "center" }}>{text}</Text>
    </TouchableOpacity>
  )
}

export default Feature

const styles = StyleSheet.create({})