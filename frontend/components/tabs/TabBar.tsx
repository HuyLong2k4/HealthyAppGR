import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import React from "react"
import { StyleSheet, View } from "react-native"
import TabBarItem from "./TabBarItem"

// TabBar có kiểu dữ liệu là BottomTabBarProps
const TabBar : React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation
}) => {
    const activeColor = '#3B82F6'
    const inactiveColor = 'gray'


    return (
        <View style={styles.container}>
            {
                state.routes.map((routes, index) => {
                    const isFocus = state.index == index
                    const { options } = descriptors[routes.key] 
                    const iconName = (descriptors[routes.key].options as any).tabBarIconName ?? "circle"
                    let labelName = options.title !== undefined ? options.title : routes.name

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
                    return (
                        <TabBarItem 
                            key={routes.key}
                            label={labelName}
                            color={ isFocus ? activeColor : inactiveColor }
                            routeName={routes.name}
                            iconName={iconName}
                            onPress={onPress}
                        />
                        
                    )
                })
            }
        </View>
    )
}

export default TabBar


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10
    }
})