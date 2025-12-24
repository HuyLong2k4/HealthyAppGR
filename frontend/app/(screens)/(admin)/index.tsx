import { useAuth } from '@/context/AuthContext';
import { useCourse } from '@/context/CourseContext';
import { useDoctor } from '@/context/DoctorContext';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
  route: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { courses, refreshCourses } = useCourse();
  const { users, fetchAllUsers } = useUser();
  const { doctors, fetchAllDoctors } = useDoctor();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load initial data only once
  useEffect(() => {
    if (!hasLoaded) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          
          // Load courses (required)
          await refreshCourses();
          
          // Try to load users (optional, don't block if fails)
          try {
            await fetchAllUsers();
          } catch (userError) {
            console.log('Users API not available yet:', userError);
          }

          // Try to load doctors (optional)
          try {
            await fetchAllDoctors();
          } catch (doctorError) {
            console.log('Doctors API not available yet:', doctorError);
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setIsLoading(false);
          setHasLoaded(true);
        }
      };
      
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCourses();
      try {
        await fetchAllUsers();
      } catch (userError) {
        console.log('Users API not available yet:', userError);
      }
      try {
        await fetchAllDoctors();
      } catch (doctorError) {
        console.log('Doctors API not available yet:', doctorError);
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(screens)/(stack)/login');
  };

  // Calculate statistics
  const stats: StatCard[] = [
    {
      title: 'Người dùng',
      value: users.length,
      icon: 'people',
      color: '#007bff',
      route: '/(screens)/(admin)/user/list',
    },
    {
      title: 'Bác sĩ',
      value: doctors.length,
      icon: 'medical',
      color: '#17a2b8',
      route: '/(screens)/(admin)/doctor/list',
    },
    {
      title: 'Khóa học',
      value: courses.length,
      icon: 'book',
      color: '#28a745',
      route: '/(screens)/(admin)/course/list',
    },
    {
      title: 'Bệnh nhân',
      value: users.filter((u: any) => u.role === 'PATIENT').length,
      icon: 'heart',
      color: '#dc3545',
      route: '/(screens)/(admin)/user/list',
    },
  ];

  const quickActions = [
    {
      title: 'Quản lý người dùng',
      description: 'Xem và quản lý danh sách người dùng',
      icon: 'people-outline' as const,
      color: '#007bff',
      route: '/(screens)/(admin)/user/list',
    },
    {
      title: 'Quản lý bác sĩ',
      description: 'Quản lý thông tin bác sĩ và lịch khám',
      icon: 'medical-outline' as const,
      color: '#17a2b8',
      route: '/(screens)/(admin)/doctor/list',
    },
    {
      title: 'Quản lý khóa học',
      description: 'Tạo và chỉnh sửa khóa học',
      icon: 'book-outline' as const,
      color: '#28a745',
      route: '/(screens)/(admin)/course/list',
    },
    {
      title: 'Quản lý bài học',
      description: 'Quản lý nội dung bài học',
      icon: 'document-text-outline' as const,
      color: '#ffc107',
      route: '/(screens)/(admin)/lesson/list',
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào, Admin!</Text>
            <Text style={styles.username}>{user?.username || user?.email || 'Administrator'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Tổng quan hệ thống</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.statCard, { borderLeftColor: stat.color }]}
                onPress={() => router.push(stat.route as any)}
              >
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={28} color={stat.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>
                Hệ thống có {users.length} người dùng đang hoạt động
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>
                Tổng cộng {courses.length} khóa học đã được tạo
              </Text>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <Text style={styles.activityText}>
                Dashboard cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}
              </Text>
            </View>
          </View>
        </View>

        {/* System Info */}
        <View style={styles.systemInfo}>
          <Text style={styles.systemInfoText}>
                Tip: Bạn có thể kéo xuống để làm mới dữ liệu
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
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
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: '#666',
  },
  activityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007bff',
    marginRight: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  systemInfo: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  systemInfoText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
