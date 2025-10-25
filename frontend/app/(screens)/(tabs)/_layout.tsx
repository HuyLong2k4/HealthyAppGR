import TabBar from "@/components/tabs/TabBar"
import { Tabs } from "expo-router"
import React from "react"

const _layoutTabs = () => {
    return (
        <Tabs
        tabBar={(props) => <TabBar {...props} />} 
        screenOptions={{
            // headerShown : false,
        }}>
            <Tabs.Screen name='index' options={{
                headerShown : false,
                title: 'Home',
                tabBarIconName: 'home',
            }} />
            <Tabs.Screen name='courses' options={{
                headerShown: false,
                title: 'Program',
                tabBarIconName: 'grid',
            }}/>
            <Tabs.Screen name='message' options={{
                headerShown: false,
                title: 'Mesage',
                tabBarIconName: 'message-circle',
            }}/>
            <Tabs.Screen name='setting' options={{
                headerShown : false,
                title: 'Account',
                tabBarIconName: 'user',
            }}/>
        </Tabs>
    )
}

export default _layoutTabs