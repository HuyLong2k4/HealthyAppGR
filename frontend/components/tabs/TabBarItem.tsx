import React from "react"
import { View, Text, Pressable, PressableProps } from "react-native" 
import { Feather } from "@expo/vector-icons"

interface TabBarItemProps extends PressableProps {
    label : string,
    routeName : string,
    color : string,
    iconName: keyof typeof Feather.glyphMap
} 

const TabBarItem : React.FC<TabBarItemProps> = ({
    label,
    routeName,
    color,
    iconName,
    ...props
}) => {
    return (
        <Pressable style={{
            flex : 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        {...props}
        >
            <Feather name={iconName} size={26} color={color}/>
            <Text style={[
                {
                    color
                }
            ]}>{label}</Text>
        </Pressable>
    )
}

export default TabBarItem