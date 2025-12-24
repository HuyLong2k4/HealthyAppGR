import { SpecialtyColors, SpecialtyLabels, SpecialtyType, TitleLabels } from '@/constants/DoctorConstants';
import { useDoctor } from '@/context/DoctorContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  schedule: any[];
}

export default function SelectDoctorScreen() {
  const { doctors, isLoading, fetchAllDoctors } = useDoctor();
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load doctors mỗi khi vào màn hình để có data mới nhất
  const loadDoctors = useCallback(async () => {
    if (hasLoaded) return; // Chỉ load 1 lần khi mount
    
    try {
      await fetchAllDoctors();
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]); // Chỉ phụ thuộc vào hasLoaded

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllDoctors(); // Gọi trực tiếp, không qua useCallback
    } catch (error) {
      console.error('Error refreshing doctors:', error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    let filtered = doctors;

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter((doc: Doctor) => doc.specialty === selectedSpecialty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((doc: Doctor) =>
        doc.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        SpecialtyLabels[doc.specialty]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, selectedSpecialty, searchQuery]);

  const handleSelectDoctor = (doctor: Doctor) => {
    router.push({
      pathname: '/(screens)/(stack)/appointment/bookAppointment',
      params: {
        doctorId: doctor._id,
        doctorName: doctor.user.username,
        doctorTitle: doctor.title,
        specialty: doctor.specialty,
        price: doctor.price.toString(),
        schedule: JSON.stringify(doctor.schedule),
      },
    });
  };

  const getSpecialtyIcon = (specialty: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      [SpecialtyType.CARDIOLOGY]: 'heart',
      [SpecialtyType.DERMATOLOGY]: 'body',
      [SpecialtyType.NEUROLOGY]: 'pulse',
      [SpecialtyType.ORTHOPEDICS]: 'fitness',
      [SpecialtyType.PEDIATRICS]: 'happy',
      [SpecialtyType.GENERAL]: 'medical',
    };
    return iconMap[specialty] || 'medical';
  };

  const renderSpecialtyFilter = () => (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Ionicons name="filter" size={18} color="#333" />
        <Text style={styles.filterTitle}>Chuyên khoa</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specialtyScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.specialtyChip, 
            !selectedSpecialty && styles.specialtyChipActive
          ]}
          onPress={() => setSelectedSpecialty('')}
          activeOpacity={0.7}
        >
          {!selectedSpecialty ? (
            <LinearGradient
              colors={['#007bff', '#0056b3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chipGradient}
            >
              <Ionicons name="apps" size={16} color="#fff" />
              <Text style={[styles.specialtyText, styles.specialtyTextActive]}>
                Tất cả
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.chipContent}>
              <Ionicons name="apps" size={16} color="#666" />
              <Text style={styles.specialtyText}>Tất cả</Text>
            </View>
          )}
        </TouchableOpacity>
        {Object.entries(SpecialtyType).map(([key, value]) => {
          const isActive = selectedSpecialty === value;
          const color = SpecialtyColors[value] || '#999';
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.specialtyChip,
                isActive && styles.specialtyChipActive,
              ]}
              onPress={() => setSelectedSpecialty(value)}
              activeOpacity={0.7}
            >
              {isActive ? (
                <LinearGradient
                  colors={[color, color + 'dd']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.chipGradient}
                >
                  <Ionicons name={getSpecialtyIcon(value)} size={16} color="#fff" />
                  <Text style={[styles.specialtyText, styles.specialtyTextActive]}>
                    {SpecialtyLabels[value]}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[styles.chipContent, { borderColor: color }]}>
                  <Ionicons name={getSpecialtyIcon(value)} size={16} color={color} />
                  <Text style={[styles.specialtyText, { color }]}>
                    {SpecialtyLabels[value]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderDoctorCard = ({ item }: { item: Doctor }) => {
    const specialtyColor = SpecialtyColors[item.specialty] || '#999';

    return (
      <TouchableOpacity
        style={styles.doctorCard}
        onPress={() => handleSelectDoctor(item)}
      >
        <View style={styles.doctorHeader}>
          {item.user?.imageURL ? (
            <Image source={{ uri: item.user.imageURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {item.user?.username?.charAt(0).toUpperCase() || 'D'}
              </Text>
            </View>
          )}

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {TitleLabels[item.title]} {item.user?.username}
            </Text>
            <View style={[styles.specialtyBadge, { backgroundColor: specialtyColor + '20' }]}>
              <Ionicons name="medical" size={12} color={specialtyColor} />
              <Text style={[styles.specialtyBadgeText, { color: specialtyColor }]}>
                {SpecialtyLabels[item.specialty]}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Ionicons name="cash-outline" size={14} color="#28a745" />
              <Text style={styles.priceText}>
                {item.price.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={24} color="#999" />
        </View>
      </TouchableOpacity>
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chọn bác sĩ</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bác sĩ hoặc chuyên khoa..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Specialty Filter */}
        {renderSpecialtyFilter()}

        {/* Doctor List */}
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy bác sĩ</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 0.3,
  },
  specialtyScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  specialtyChip: {
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  specialtyChipActive: {
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  chipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 24,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.2,
  },
  specialtyTextActive: {
    color: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    gap: 4,
  },
  specialtyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
