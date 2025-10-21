import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const BoxTarget = ({
    iconName,
    title,
    description,
} : {
    iconName : string
    title : string
    description : string
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Placeholder icon */}
        <FontAwesome name={iconName} size={25} color={"#73C3F4"} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{description}</Text>
      </View>
      <View style={styles.checkContainer}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      </View>
    </View>
  )
}

export default BoxTarget

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20
  },
  iconContainer: {
    backgroundColor: '#B3E5FC',
    padding: 10,
    borderRadius: 8,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  checkContainer: {
    marginLeft: 'auto',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
