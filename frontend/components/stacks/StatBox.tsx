import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

const StatBox = ({ 
    iconName,
    label,
    value,
    unit,
    color
} : {
    iconName: string
    label : string
    value: string
    unit: string
    color: string
}) => {
  return (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
        <Feather name={iconName} size={20} color={color} />
        <Text style={{ color }}>{label}</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {value} <Text style={{ fontSize: 14 }}>{unit}</Text>
        </Text>
    </View>
  )
}

export default StatBox

const styles = StyleSheet.create({
    statBox: {
    width: "48%",
    padding: 15,
    borderLeftWidth: 4,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
  },
})