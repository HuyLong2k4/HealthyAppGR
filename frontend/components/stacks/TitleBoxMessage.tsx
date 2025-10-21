import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import TitleBoxMessageItem from './TitleBoxMessageItem'

const TitleBoxMessage : React.FC<BottomTabBarProps>= ({
    state,
    descriptors,
    navigation
}) => {
    const activeColor = '#3B82F6'
  return (
    <View>
      {
        state.routes.map(( routes, index ) => {
            const isFocus = state.index == index

            const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: routes.key,
                    canPreventDefault : true
                })
                if(!isFocus && !event.defaultPrevented) {
                    navigation.navigate(routes.name, routes.params)
                }
            }
            return(
               
            )
        })
      }
    </View>
  )
}

export default TitleBoxMessage

const styles = StyleSheet.create({})