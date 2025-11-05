import React from 'react';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

interface BoxAddNewTargetProps {
  textInput: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}

const BoxAddNewTarget = ({ 
  textInput, 
  value, 
  onChangeText, 
  keyboardType = 'default',
  placeholder 
}: BoxAddNewTargetProps) => {
  return (
    <View style={styles.container}>
        <TextInput
        placeholder={placeholder || textInput}
        style={styles.input}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
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