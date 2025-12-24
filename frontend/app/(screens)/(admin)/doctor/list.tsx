import { DaysOfWeek, SpecialtyColors, SpecialtyLabels, TitleLabels } from '@/constants/DoctorConstants';
import { useDoctor } from '@/context/DoctorContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
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

interface Doctor {
  _id: string;
  user: {
    _id: string;
    username: string;
    email?: string;
    phone?: string;
    imageURL?: string;
  };
  specialty: string;
  title: string;
  price: number;
  schedule: Schedule[];
}

export default function DoctorListScreen() {
  const { doctors, isLoading, fetchAllDoctors, deleteDoctor } = useDoctor();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadDoctors = useCallback(async () => {
    if (hasLoaded) return;
    
    try {
      await fetchAllDoctors();
      setHasLoaded(true);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách bác sĩ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter((doctor: Doctor) => 
        doctor.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SpecialtyLabels[doctor.specialty]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllDoctors();
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách bác sĩ');
    }
    setRefreshing(false);
  };

  const handleDeleteDoctor = (doctorId: string, doctorName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa bác sĩ "${doctorName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoctor(doctorId);
              Alert.alert('Thành công', 'Đã xóa bác sĩ');
            } catch {
              Alert.alert('Lỗi', 'Không thể xóa bác sĩ');
            }
          },
        },
      ]
    );
  };

  const renderDoctorCard = ({ item }: { item: Doctor }) => {
    const specialtyColor = SpecialtyColors[item.specialty] || '#999';
    
    return (
      <View style={styles.doctorCard}>
        {/* Header with Avatar */}
        <View style={styles.doctorHeader}>
          <View style={styles.avatarContainer}>
            {item.user?.imageURL ? (
              <Image source={{ uri: item.user.imageURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {item.user?.username?.charAt(0).toUpperCase() || 'D'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {TitleLabels[item.title] || item.title} {item.user?.username}
            </Text>
            <View style={[styles.specialtyBadge, { backgroundColor: specialtyColor + '20' }]}>
              <Ionicons name="medical" size={12} color={specialtyColor} />
              <Text style={[styles.specialtyText, { color: specialtyColor }]}>
                {SpecialtyLabels[item.specialty] || item.specialty}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.detailsContainer}>
          {item.user?.email && (
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{item.user.email}</Text>
            </View>
          )}
          {item.user?.phone && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{item.user.phone}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={14} color="#28a745" />
            <Text style={[styles.detailText, styles.priceText]}>
              {item.price.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
        </View>

        {/* Schedule Summary */}
        {item.schedule && item.schedule.length > 0 && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>Lịch làm việc:</Text>
            <View style={styles.scheduleDays}>
              {item.schedule.map((sch, idx) => (
                <View key={idx} style={styles.dayChip}>
                  <Text style={styles.dayText}>{DaysOfWeek[sch.dayOfWeek]}</Text>
                  <Text style={styles.timeText}>
                    {sch.startTime} - {sch.endTime}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => router.push('/(screens)/(admin)/doctor/list' as any)}
          >
            <Ionicons name="eye-outline" size={16} color="#007bff" />
            <Text style={[styles.actionText, { color: '#007bff' }]}>Chi tiết</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/(screens)/(admin)/doctor/update?id=${item._id}` as any)}
          >
            <Ionicons name="create-outline" size={16} color="#ffc107" />
            <Text style={[styles.actionText, { color: '#ffc107' }]}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteDoctor(item._id, item.user?.username || 'bác sĩ')}
          >
            <Ionicons name="trash-outline" size={16} color="#dc3545" />
            <Text style={[styles.actionText, { color: '#dc3545' }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading && doctors.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý bác sĩ</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(screens)/(admin)/doctor/list' as any)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          Tổng số: <Text style={styles.statsNumber}>{filteredDoctors.length}</Text> bác sĩ
        </Text>
      </View>

      {/* Doctor List */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id}
        renderItem={renderDoctorCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Không tìm thấy bác sĩ' : 'Chưa có bác sĩ nào'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  statsBar: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  statsNumber: {
    fontWeight: 'bold',
    color: '#007bff',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  doctorCard: {
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
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  priceText: {
    fontWeight: '600',
    color: '#28a745',
  },
  scheduleContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  scheduleDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007bff',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  viewButton: {
    backgroundColor: '#e7f3ff',
  },
  editButton: {
    backgroundColor: '#fff9e6',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
