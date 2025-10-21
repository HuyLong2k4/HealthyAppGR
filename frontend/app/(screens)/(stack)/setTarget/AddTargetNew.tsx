import BoxAddNewTarget from '@/components/stacks/BoxAddNewTarget'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AddTargetNew = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.titleText}> Thiết lập mục tiêu mới </Text>
      </View>
      <View>
            <Text style={styles.bodyTitle}>Mục tiêu mới</Text>
      </View>
      <BoxAddNewTarget textInput={"Mục tiêu mới"}></BoxAddNewTarget>
      <BoxAddNewTarget textInput={"Số lượng"}></BoxAddNewTarget>
      <BoxAddNewTarget textInput={"Đơn vị"}></BoxAddNewTarget>
      <View>
            <Text style={styles.bodyTitle}>Thói quen mới</Text>
      </View>
      <BoxAddNewTarget textInput={"Thói quen mới"}></BoxAddNewTarget>
      <BoxAddNewTarget textInput={"Số lượng"}></BoxAddNewTarget>
      <BoxAddNewTarget textInput={"Đơn vị"}></BoxAddNewTarget>

      <View style={styles.footerBtn}>
        <TouchableOpacity style={styles.goalButton}>
                    <Text style={styles.goalButtonText} onPress={() => router.push("/(screens)/(stack)/setTarget")}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goalButton}>
                    <Text style={styles.goalButtonText} onPress={() => router.push("/(screens)/(stack)/setTarget")}>Thêm mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddTargetNew

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

    footerBtn: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between", 
      gap: 10,
    },
    goalButton: {
      backgroundColor: "#4285F4",
      paddingVertical: 20,
      paddingHorizontal: 30,
      borderRadius: 20,
      alignItems: "center",
      flex: 1,
      marginHorizontal: 5,
    },
    goalButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
})