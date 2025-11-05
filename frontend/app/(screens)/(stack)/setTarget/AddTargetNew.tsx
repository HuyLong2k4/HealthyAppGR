import BoxAddNewTarget from '@/components/stacks/BoxAddNewTarget'
import { CategoryColors, CategoryIcons, CategoryLabels, GoalCategory, GoalCategoryType, GoalUnit, GoalUnitType, UnitLabels } from '@/constants/DailyGoalConstants'
import { useDailyGoal } from '@/context/DailyGoalContext'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const AddTargetNew = () => {
  const { createDailyGoal } = useDailyGoal();
  const params = useLocalSearchParams();
  const selectedDate = params.date ? new Date(params.date as string) : new Date();

  const [goalName, setGoalName] = useState('');
  const [goalQuantity, setGoalQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategoryType>(GoalCategory.CUSTOM);
  const [selectedUnit, setSelectedUnit] = useState<GoalUnitType>(GoalUnit.TIMES);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);

  const handleAddGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mục tiêu');
      return;
    }
    if (!goalQuantity.trim() || isNaN(Number(goalQuantity)) || Number(goalQuantity) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ (lớn hơn 0)');
      return;
    }

    const goalData = {
      targetDate: selectedDate.toISOString().split('T')[0],
      name: goalName,
      quantity: Number(goalQuantity),
      unit: selectedUnit,
      category: selectedCategory
    };

    const success = await createDailyGoal(goalData);
    if (success) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titleText}> Thiết lập mục tiêu mới </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>
            Ngày: {selectedDate.toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View>
          <Text style={styles.bodyTitle}>Loại mục tiêu</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <View style={styles.selectContent}>
            <View style={[styles.iconContainer, { backgroundColor: CategoryColors[selectedCategory] + '20' }]}>
              <Ionicons 
                name={CategoryIcons[selectedCategory] as any} 
                size={24} 
                color={CategoryColors[selectedCategory]} 
              />
            </View>
            <Text style={styles.selectText}>{CategoryLabels[selectedCategory]}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View>
          <Text style={styles.bodyTitle}>Thông tin mục tiêu</Text>
        </View>
        
        <BoxAddNewTarget 
          textInput={"Tên mục tiêu"} 
          value={goalName}
          onChangeText={setGoalName}
          placeholder="VD: Chạy bộ buổi sáng"
        />

        <View>
          <Text style={styles.bodyTitle}>Số lượng</Text>
        </View>
        
        <BoxAddNewTarget 
          textInput={"Số lượng"} 
          value={goalQuantity}
          onChangeText={setGoalQuantity}
          keyboardType="numeric"
          placeholder="VD: 5"
        />

        <View>
          <Text style={styles.bodyTitle}>Đơn vị</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={() => setShowUnitModal(true)}
        >
          <Text style={styles.selectText}>{UnitLabels[selectedUnit]}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.footerBtn}>
          <TouchableOpacity 
            style={[styles.goalButton, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.goalButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.goalButton}
            onPress={handleAddGoal}
          >
            <Text style={styles.goalButtonText}>Thêm mới</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn loại mục tiêu</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.entries(GoalCategory).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modalItem,
                    selectedCategory === value && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedCategory(value);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={styles.modalItemContent}>
                    <View style={[styles.iconContainer, { backgroundColor: CategoryColors[value] + '20' }]}>
                      <Ionicons 
                        name={CategoryIcons[value] as any} 
                        size={24} 
                        color={CategoryColors[value]} 
                      />
                    </View>
                    <Text style={styles.modalItemText}>{CategoryLabels[value]}</Text>
                  </View>
                  {selectedCategory === value && (
                    <Ionicons name="checkmark" size={24} color="#4285F4" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Unit Modal */}
      <Modal
        visible={showUnitModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUnitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn đơn vị</Text>
              <TouchableOpacity onPress={() => setShowUnitModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.entries(GoalUnit).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modalItem,
                    selectedUnit === value && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setSelectedUnit(value);
                    setShowUnitModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{UnitLabels[value]}</Text>
                  {selectedUnit === value && (
                    <Ionicons name="checkmark" size={24} color="#4285F4" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
        fontWeight: "600",
    },
    dateInfo: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#E3F2FD",
        borderRadius: 10,
        alignItems: "center",
    },
    dateText: {
        fontSize: 16,
        color: "#1976D2",
        fontWeight: "500",
    },
    bodyTitle: {
        marginTop: 30,
        marginBottom: 10,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    selectButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 10,
    },
    selectContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    selectText: {
        fontSize: 16,
        color: "#333",
    },
    footerBtn: {
      marginTop: 40,
      marginBottom: 20,
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
    cancelButton: {
      backgroundColor: "#9E9E9E",
    },
    goalButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "70%",
      paddingBottom: 20,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    modalItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    },
    modalItemSelected: {
      backgroundColor: "#E3F2FD",
    },
    modalItemContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    modalItemText: {
      fontSize: 16,
      color: "#333",
    },
})