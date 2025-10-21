import { View, Text, PressableProps, Pressable } from 'react-native'
import React from 'react'

interface TitleBoxMessageItemProps extends PressableProps {
    color: string
}

const TitleBoxMessageItem = () => {
  return (
    <Pressable>
      <Text>TitleBoxMessageItem</Text>
    </Pressable>
  )
}

export default TitleBoxMessageItem