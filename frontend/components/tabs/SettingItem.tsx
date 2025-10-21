import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

const SettingItem = ({ icon, text, onPress, color = '#000'}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.itemText, { color }]}>{text}</Text>
        <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  )
}

export default SettingItem

const styles = StyleSheet.create({
    item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
})