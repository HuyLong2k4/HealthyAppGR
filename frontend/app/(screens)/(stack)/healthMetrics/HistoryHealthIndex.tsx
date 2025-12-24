import {
  HealthIndexType,
  getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HistoryHealthIndex() {
  const router = useRouter();
  const { healthIndexes, isLoading } = useHealthIndexes();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHealthIndexCard = (healthIndex: any, index: number) => {
    const metrics = [];

    if (healthIndex.bodyTemperature) {
      const config = getHealthIndexConfig(HealthIndexType.BODY_TEMPERATURE);
      metrics.push({ ...config, value: healthIndex.bodyTemperature, type: HealthIndexType.BODY_TEMPERATURE });
    }
    
    if (healthIndex.heartRate) {
      const config = getHealthIndexConfig(HealthIndexType.HEART_RATE);
      metrics.push({ ...config, value: healthIndex.heartRate, type: HealthIndexType.HEART_RATE });
    }
    
    if (healthIndex.oxygenSaturation) {
      const config = getHealthIndexConfig(HealthIndexType.OXYGEN_SATURATION);
      metrics.push({ ...config, value: healthIndex.oxygenSaturation, type: HealthIndexType.OXYGEN_SATURATION });
    }
    
    if (healthIndex.respiratoryRate) {
      const config = getHealthIndexConfig(HealthIndexType.RESPIRATORY_RATE);
      metrics.push({ ...config, value: healthIndex.respiratoryRate, type: HealthIndexType.RESPIRATORY_RATE });
    }
    
    if (healthIndex.sleep) {
      const config = getHealthIndexConfig(HealthIndexType.SLEEP);
      metrics.push({ ...config, value: healthIndex.sleep, type: HealthIndexType.SLEEP });
    }
    
    if (healthIndex.stepCount) {
      const config = getHealthIndexConfig(HealthIndexType.STEP_COUNT);
      metrics.push({ ...config, value: healthIndex.stepCount, type: HealthIndexType.STEP_COUNT });
    }

    return (
      <View key={index} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.dateText}>
              {formatDate(healthIndex.recordedTime || healthIndex.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.metricsGrid}>
          {metrics.map((metric, idx) => (
            <View key={idx} style={styles.metricItem}>
              <LinearGradient
                colors={[metric.color, metric.color + 'cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.metricIcon}
              >
                <Ionicons name={metric.icon as any} size={20} color="#fff" />
              </LinearGradient>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>
                  {metric.value} <Text style={styles.metricUnit}>{metric.unit}</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử chỉ số sức khỏe</Text>
        <TouchableOpacity 
          onPress={() => router.push("/(screens)/(stack)/healthMetrics/AddHealthIndex" as any)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        ) : healthIndexes && healthIndexes.length > 0 ? (
          <>
            <Text style={styles.totalText}>
              Tổng số bản ghi: {healthIndexes.length}
            </Text>
            {healthIndexes.map((healthIndex: any, index: number) => renderHealthIndexCard(healthIndex, index))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có dữ liệu chỉ số sức khỏe</Text>
            <Text style={styles.emptySubText}>
              Nhấn vào nút + ở góc trên để thêm chỉ số mới
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  addButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  totalText: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  metricUnit: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#64748b',
  },
});
