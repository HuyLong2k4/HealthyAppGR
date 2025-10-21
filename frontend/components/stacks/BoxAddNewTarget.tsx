import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const BoxAddNewTarget = ({ textInput } : { textInput : string }) => {
  return (
    <View style={styles.container}>
        <TextInput
        placeholder={textInput}
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  )
}

export default BoxAddNewTarget

const styles = StyleSheet.create({
    container : {
        padding: 10,
    },

    input: {
    height: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
    fontSize: 14,
    backgroundColor: '#fff',
    },
})