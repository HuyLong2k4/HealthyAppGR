import { DaysOfWeek, DoctorTitle, SpecialtyLabels, SpecialtyType, TitleLabels } from '@/constants/DoctorConstants';
import { useDoctor } from '@/context/DoctorContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  _id?: string;
}

export default function UpdateDoctorScreen() {
  const { id } = useLocalSearchParams();
  const { getDoctorById, updateDoctor } = useDoctor();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form fields
  const [specialty, setSpecialty] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  
  // Doctor info
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadDoctor = useCallback(async () => {
    if (hasLoaded) return;
    
    try {
      setIsLoading(true);
      const doctor = await getDoctorById(id as string);
      
      if (doctor) {
        setDoctorInfo(doctor);
        setSpecialty(doctor.specialty);
        setTitle(doctor.title);
        setPrice(doctor.price.toString());
        setSchedule(doctor.schedule || []);
        setHasLoaded(true);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể tải thông tin bác sĩ');
      router.back();
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, hasLoaded]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '17:00',
      slotDuration: 30,
    };
    setSchedule([...schedule, newSchedule]);
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const handleUpdateSchedule = (index: number, field: keyof Schedule, value: any) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: value,
    };
    setSchedule(updatedSchedule);
  };

  const handleSubmit = async () => {
    // Validation
    if (!specialty || !title || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá khám không hợp lệ');
      return;
    }

    if (schedule.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất 1 lịch làm việc');
      return;
    }

    try {
      setIsSaving(true);

      const doctorData: any = {
        specialty,
        title,
        price: priceNum,
        schedule: schedule.map(sch => ({
          dayOfWeek: sch.dayOfWeek,
          startTime: sch.startTime,
          endTime: sch.endTime,
          slotDuration: sch.slotDuration,
        })),
      };

      // Admin phải gửi userId của doctor để backend xác thực quyền
      if (doctorInfo?.user?._id) {
        doctorData.user = doctorInfo.user._id;
      }

      console.log('Updating doctor:', id, 'with data:', doctorData);
      await updateDoctor(id as string, doctorData);

      Alert.alert('Thành công', 'Đã cập nhật thông tin bác sĩ', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Update failed:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin bác sĩ');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cập nhật bác sĩ</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Doctor Info */}
          {doctorInfo && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Thông tin bác sĩ:</Text>
              <Text style={styles.infoText}>
                👤 {doctorInfo.user?.username || 'N/A'}
              </Text>
              {doctorInfo.user?.email && (
                <Text style={styles.infoText}>✉ {doctorInfo.user.email}</Text>
              )}
              {doctorInfo.user?.phone && (
                <Text style={styles.infoText}>☎ {doctorInfo.user.phone}</Text>
              )}
            </View>
          )}

          {/* Specialty */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Chuyên khoa *</Text>
            <View style={styles.optionsGrid}>
              {Object.entries(SpecialtyType).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    specialty === value && styles.optionButtonActive,
                  ]}
                  onPress={() => setSpecialty(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      specialty === value && styles.optionTextActive,
                    ]}
                  >
                    {SpecialtyLabels[value]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Học hàm học vị *</Text>
            <View style={styles.optionsGrid}>
              {Object.entries(DoctorTitle).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    title === value && styles.optionButtonActive,
                  ]}
                  onPress={() => setTitle(value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      title === value && styles.optionTextActive,
                    ]}
                  >
                    {TitleLabels[value]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Giá khám *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Nhập giá khám (VNĐ)"
              keyboardType="numeric"
            />
          </View>

          {/* Schedule */}
          <View style={styles.formGroup}>
            <View style={styles.scheduleLabelRow}>
              <Text style={styles.label}>Lịch làm việc *</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
                <Ionicons name="add-circle" size={24} color="#28a745" />
                <Text style={styles.addButtonText}>Thêm lịch</Text>
              </TouchableOpacity>
            </View>

            {schedule.map((sch, index) => (
              <View key={index} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <Text style={styles.scheduleTitle}>Lịch {index + 1}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSchedule(index)}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>

                {/* Day of Week */}
                <View style={styles.scheduleField}>
                  <Text style={styles.scheduleLabel}>Ngày trong tuần:</Text>
                  <View style={styles.daysGrid}>
                    {Object.entries(DaysOfWeek).map(([dayNum, dayName]) => (
                      <TouchableOpacity
                        key={dayNum}
                        style={[
                          styles.dayButton,
                          sch.dayOfWeek === parseInt(dayNum) && styles.dayButtonActive,
                        ]}
                        onPress={() => handleUpdateSchedule(index, 'dayOfWeek', parseInt(dayNum))}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            sch.dayOfWeek === parseInt(dayNum) && styles.dayButtonTextActive,
                          ]}
                        >
                          {dayName.substring(0, 2)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Time Range */}
                <View style={styles.scheduleRow}>
                  <View style={styles.scheduleFieldHalf}>
                    <Text style={styles.scheduleLabel}>Giờ bắt đầu:</Text>
                    <TextInput
                      style={styles.inputSmall}
                      value={sch.startTime}
                      onChangeText={(value) => handleUpdateSchedule(index, 'startTime', value)}
                      placeholder="08:00"
                    />
                  </View>
                  <View style={styles.scheduleFieldHalf}>
                    <Text style={styles.scheduleLabel}>Giờ kết thúc:</Text>
                    <TextInput
                      style={styles.inputSmall}
                      value={sch.endTime}
                      onChangeText={(value) => handleUpdateSchedule(index, 'endTime', value)}
                      placeholder="17:00"
                    />
                  </View>
                </View>

                {/* Slot Duration */}
                <View style={styles.scheduleField}>
                  <Text style={styles.scheduleLabel}>Thời gian 1 slot (phút):</Text>
                  <TextInput
                    style={styles.inputSmall}
                    value={sch.slotDuration.toString()}
                    onChangeText={(value) => handleUpdateSchedule(index, 'slotDuration', parseInt(value) || 30)}
                    placeholder="30"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Cập nhật</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#e7f3ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputSmall: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: '48%',
  },
  optionButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#fff',
  },
  scheduleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scheduleField: {
    marginBottom: 12,
  },
  scheduleLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 50,
  },
  dayButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  scheduleFieldHalf: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
