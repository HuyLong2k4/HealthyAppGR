import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const StatBox = ({ 
    iconName,
    label,
    value,
    unit,
    color,
    onPress
} : {
    iconName: string
    label : string
    value: string
    unit: string
    color: string
    onPress?: () => void
}) => {
  const Content = (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName as any} size={24} color={color} />
        </View>
        <Text style={[styles.label, { color }]} numberOfLines={1}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {value}
          </Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.wrapper}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
}

export default StatBox

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
    marginBottom: 12,
  },
  statBox: {
    width: "100%",
    padding: 15,
    borderLeftWidth: 4,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    minHeight: 110,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  unit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
})