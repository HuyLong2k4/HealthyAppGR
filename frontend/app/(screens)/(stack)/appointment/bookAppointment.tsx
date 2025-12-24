import { SpecialtyLabels, TitleLabels } from '@/constants/DoctorConstants';
import { useAppointment } from '@/context/AppointmentContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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

export default function BookAppointmentScreen() {
  const params = useLocalSearchParams();
  const { doctorId, doctorName, doctorTitle, specialty, price, schedule } = params;
  
  const { createAppointment } = useAppointment();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse schedule
  const doctorSchedule = schedule ? JSON.parse(schedule as string) : [];

  // Form states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Generate next 14 days
  const getNext14Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayOfWeek = date.getDay();
      const dayName = dayNames[dayOfWeek];
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = `${date.getDate()}/${date.getMonth() + 1}`;
      
      // Check if doctor works on this day
      const hasSchedule = doctorSchedule.some((sch: any) => sch.dayOfWeek === dayOfWeek);
      
      days.push({
        date: dateStr,
        dayName,
        displayDate,
        dayOfWeek,
        isToday: i === 0,
        hasSchedule,
      });
    }
    
    return days;
  };

  // Generate time slots based on doctor's schedule for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const selectedDay = new Date(selectedDate).getDay();
    const daySchedule = doctorSchedule.find((sch: any) => sch.dayOfWeek === selectedDay);
    
    if (!daySchedule) return [];
    
    const slots = [];
    const startTime = daySchedule.startTime; // e.g., "08:00"
    const endTime = daySchedule.endTime;     // e.g., "17:00"
    const slotDuration = daySchedule.slotDuration || 30; // minutes
    
    // Parse start and end time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      // Add slot duration
      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }
    
    return slots;
  };

  const timeSlots = getAvailableTimeSlots();

  const handleSubmit = async () => {
    // Validation
    if (!selectedDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn ngày khám');
      return;
    }

    if (!selectedTime) {
      Alert.alert('Lỗi', 'Vui lòng chọn giờ khám');
      return;
    }

    try {
      setIsSubmitting(true);

      const appointmentData = {
        doctor: doctorId,
        specialty: specialty,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: notes.trim() || undefined,
      };

      await createAppointment(appointmentData);

      Alert.alert(
        'Thành công',
        'Đặt lịch hẹn thành công! Vui lòng chờ bác sĩ xác nhận.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Bạn đã có lịch hẹn vào thời gian này. Vui lòng chọn thời gian khác.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt lịch khám</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Doctor Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin bác sĩ</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#007bff" />
              <Text style={styles.infoText}>
                {TitleLabels[doctorTitle as string]} {doctorName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="medical" size={20} color="#007bff" />
              <Text style={styles.infoText}>
                {SpecialtyLabels[specialty as string]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color="#28a745" />
              <Text style={[styles.infoText, { color: '#28a745', fontWeight: '600' }]}>
                {parseInt(price as string).toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          </View>

          {/* Select Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn ngày khám *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScrollContainer}
            >
              {getNext14Days().map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dateCard,
                    selectedDate === day.date && styles.dateCardActive,
                    day.isToday && styles.dateCardToday,
                    !day.hasSchedule && styles.dateCardDisabled,
                  ]}
                  onPress={() => {
                    if (day.hasSchedule) {
                      setSelectedDate(day.date);
                      setSelectedTime(''); // Reset time when date changes
                    }
                  }}
                  disabled={!day.hasSchedule}
                >
                  <Text
                    style={[
                      styles.dayName,
                      selectedDate === day.date && styles.dateTextActive,
                      !day.hasSchedule && styles.dateTextDisabled,
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate === day.date && styles.dateTextActive,
                      !day.hasSchedule && styles.dateTextDisabled,
                    ]}
                  >
                    {day.displayDate}
                  </Text>
                  {day.isToday && day.hasSchedule && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>Hôm nay</Text>
                    </View>
                  )}
                  {!day.hasSchedule && (
                    <View style={styles.noScheduleBadge}>
                      <Text style={styles.noScheduleText}>Nghỉ</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Select Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn giờ khám *</Text>
            {selectedDate ? (
              timeSlots.length > 0 ? (
                <View style={styles.timeGrid}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.timeSlotActive,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={selectedTime === time ? '#fff' : '#666'}
                      />
                      <Text
                        style={[
                          styles.timeText,
                          selectedTime === time && styles.timeTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyTimeSlots}>
                  <Ionicons name="time-outline" size={32} color="#ccc" />
                  <Text style={styles.emptyText}>Bác sĩ không làm việc trong ngày này</Text>
                </View>
              )
            ) : (
              <View style={styles.emptyTimeSlots}>
                <Ionicons name="calendar-outline" size={32} color="#ccc" />
                <Text style={styles.emptyText}>Vui lòng chọn ngày khám</Text>
              </View>
            )}
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú (tùy chọn)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Nhập triệu chứng, yêu cầu đặc biệt..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Xác nhận đặt lịch</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Note */}
          <View style={styles.noteCard}>
            <Ionicons name="information-circle" size={20} color="#ffc107" />
            <Text style={styles.noteText}>
              Lịch hẹn sẽ được xác nhận sau khi bác sĩ kiểm tra. Bạn sẽ nhận được thông báo khi
              lịch hẹn được xác nhận.
            </Text>
          </View>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateScrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  dateCardActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dateCardToday: {
    borderColor: '#ffc107',
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateTextActive: {
    color: '#fff',
  },
  todayBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  todayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  dateCardDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  dateTextDisabled: {
    color: '#999',
  },
  noScheduleBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  noScheduleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '22%',
    justifyContent: 'center',
  },
  timeSlotActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeTextActive: {
    color: '#fff',
  },
  emptyTimeSlots: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
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
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
});
