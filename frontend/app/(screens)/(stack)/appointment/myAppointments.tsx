import { AppointmentStatus, AppointmentStatusColors, AppointmentStatusLabels, SpecialtyLabels } from '@/constants/AppointmentConstants';
import { TitleLabels } from '@/constants/DoctorConstants';
import { useAppointment } from '@/context/AppointmentContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Appointment {
  _id: string;
  doctor: {
    _id: string;
    user: {
      username: string;
      email?: string;
      phone?: string;
    };
    title: string;
    specialty: string;
    price: number;
  };
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function MyAppointmentsScreen() {
  const { appointments, isLoading, getMyAppointments, cancelAppointment } = useAppointment();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (hasLoaded) return;
    
    try {
      await getMyAppointments();
      setHasLoaded(true);
    } catch {
      console.error('Error loading appointments');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    let filtered = appointments;

    if (filterStatus) {
      filtered = filtered.filter((app: Appointment) => app.status === filterStatus);
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a: Appointment, b: Appointment) => {
      return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
    });

    setFilteredAppointments(filtered);
  }, [appointments, filterStatus]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getMyAppointments();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách lịch hẹn');
    }
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy lịch',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId, 'Bệnh nhân hủy');
              Alert.alert('Thành công', 'Đã hủy lịch hẹn');
              await getMyAppointments();
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể hủy lịch hẹn');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterChip, !filterStatus && styles.filterChipActive]}
        onPress={() => setFilterStatus('')}
      >
        <Text style={[styles.filterText, !filterStatus && styles.filterTextActive]}>
          Tất cả
        </Text>
      </TouchableOpacity>
      {Object.entries(AppointmentStatus).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.filterChip,
            filterStatus === value && styles.filterChipActive,
            { borderColor: AppointmentStatusColors[value] },
          ]}
          onPress={() => setFilterStatus(value)}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === value && styles.filterTextActive,
            ]}
          >
            {AppointmentStatusLabels[value]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAppointmentCard = ({ item }: { item: Appointment }) => {
    const statusColor = AppointmentStatusColors[item.status] || '#999';
    const canCancel = item.status === 'PENDING' || item.status === 'CONFIRMED';

    return (
      <View style={styles.appointmentCard}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{AppointmentStatusLabels[item.status]}</Text>
        </View>

        {/* Doctor Info */}
        <View style={styles.cardHeader}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {TitleLabels[item.doctor.title]} {item.doctor.user.username}
            </Text>
            <View style={styles.specialtyRow}>
              <Ionicons name="medical" size={14} color="#666" />
              <Text style={styles.specialtyText}>{SpecialtyLabels[item.specialty]}</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#007bff" />
            <Text style={styles.detailText}>{formatDate(item.appointmentDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#007bff" />
            <Text style={styles.detailText}>{item.appointmentTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={18} color="#28a745" />
            <Text style={[styles.detailText, { color: '#28a745', fontWeight: '600' }]}>
              {item.doctor.price.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
        </View>

        {/* Notes */}
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Ghi chú:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {/* Actions */}
        {canCancel && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item._id)}
            >
              <Ionicons name="close-circle-outline" size={18} color="#dc3545" />
              <Text style={styles.cancelButtonText}>Hủy lịch</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (isLoading && appointments.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
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
          <Text style={styles.headerTitle}>Lịch hẹn của tôi</Text>
          <TouchableOpacity
            onPress={() => router.push('/(screens)/(stack)/appointment/selectDoctor')}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Status Filter */}
        {renderStatusFilter()}

        {/* Appointments List */}
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có lịch hẹn nào</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/(screens)/(stack)/appointment/selectDoctor')}
              >
                <Text style={styles.emptyButtonText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            </View>
          }
        />
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
    paddingTop: 32,
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
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
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialtyText: {
    fontSize: 13,
    color: '#666',
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  notesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc3545',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
