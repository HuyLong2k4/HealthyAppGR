import BoxTarget from '@/components/stacks/BoxTarget'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const SetTargetPage = () => {
  return (
    <View style={styles.container}>
        {/* Title */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.titleText}> Thiết lập mục tiêu tuần </Text>
        </View>

        {/* Body */}
        <View>
            <View>
                <Text style={styles.bodyTitle}>Mục tiêu tuần</Text>
                <Text style={styles.bodyDescription}>06/05/2025</Text>
            </View>
        </View>

        <BoxTarget iconName='person-walking' title='Chạy' description='5km'></BoxTarget>
        <View>
                <Text style={styles.bodyTitle}>Xây dụng thói quen</Text>
            </View>
        <BoxTarget iconName='person-walking' title='Chạy' description='5km'></BoxTarget>
        <BoxTarget iconName='person-walking' title='Chạy' description='5km'></BoxTarget>

        <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText} onPress={() => router.push("/(screens)/(stack)/setTarget/AddTargetNew")}>Thêm mới</Text>
        </TouchableOpacity>
    </View>
  )
}

export default SetTargetPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        marginTop: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    titleText: {
        fontSize: 20,
        fontWeight: 600,
    },

    bodyTitle: {
        marginTop: 40,
        fontSize: 16,
        fontWeight: 500
    },

    bodyDescription: {
        marginLeft: 20,
        fontSize: 14
    },

  goalButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 20,
        margin: 100,
        alignItems: "center"
  },
  goalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})