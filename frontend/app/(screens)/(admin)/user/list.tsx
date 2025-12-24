import { useUser } from '@/context/UserContext';
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

interface User {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  role: 'ADMIN' | 'PATIENT' | 'DOCTOR';
  imageURL?: string;
}

export default function UserListScreen() {
  const { users, isLoading, fetchAllUsers, deleteUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadUsers = useCallback(async () => {
    if (hasLoaded) return;
    
    try {
      await fetchAllUsers();
      setHasLoaded(true);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user: User) => 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllUsers();
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    }
    setRefreshing(false);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userId);
              Alert.alert('Thành công', 'Đã xóa người dùng');
            } catch {
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          },
        },
      ]
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
      ADMIN: { label: 'Admin', color: '#dc3545', icon: 'shield-checkmark' },
      PATIENT: { label: 'Bệnh nhân', color: '#28a745', icon: 'person' },
      DOCTOR: { label: 'Bác sĩ', color: '#007bff', icon: 'medical' },
    };
    return roleConfig[role] || roleConfig.PATIENT;
  };

  const renderUserCard = ({ item }: { item: User }) => {
    const roleBadge = getRoleBadge(item.role);
    
    return (
      <View style={styles.userCard}>
        {/* Avatar and Basic Info */}
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            {item.imageURL ? (
              <Image source={{ uri: item.imageURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {item.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.username || 'Chưa có tên'}</Text>
            <View style={styles.roleContainer}>
              <Ionicons name={roleBadge.icon} size={14} color={roleBadge.color} />
              <Text style={[styles.roleText, { color: roleBadge.color }]}>
                {roleBadge.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.detailsContainer}>
          {item.email && (
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.email}</Text>
            </View>
          )}
          {item.phone && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{item.phone}</Text>
            </View>
          )}
          {item.dob && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {new Date(item.dob).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          )}
          {item.gender && (
            <View style={styles.detailRow}>
              <Ionicons 
                name={item.gender === 'MALE' ? 'male' : item.gender === 'FEMALE' ? 'female' : 'person'} 
                size={16} 
                color="#666" 
              />
              <Text style={styles.detailText}>
                {item.gender === 'MALE' ? 'Nam' : item.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => router.push('/(screens)/(admin)/user/list' as any)}
          >
            <Ionicons name="eye-outline" size={18} color="#007bff" />
            <Text style={[styles.actionText, { color: '#007bff' }]}>Xem</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push('/(screens)/(admin)/user/list' as any)}
          >
            <Ionicons name="create-outline" size={18} color="#ffc107" />
            <Text style={[styles.actionText, { color: '#ffc107' }]}>Sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(item._id, item.username || 'người dùng')}
          >
            <Ionicons name="trash-outline" size={18} color="#dc3545" />
            <Text style={[styles.actionText, { color: '#dc3545' }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(screens)/(admin)/user/list' as any)}
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
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
          Tổng số: <Text style={styles.statsNumber}>{filteredUsers.length}</Text> người dùng
        </Text>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserCard}
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
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
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
  userCard: {
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
  userHeader: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roleText: {
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
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 14,
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
