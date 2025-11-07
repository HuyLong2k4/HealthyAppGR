import {
  HealthIndexType,
  getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
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
              <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                <Ionicons name={metric.icon as any} size={18} color="#FFFFFF" />
              </View>
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử chỉ số sức khỏe</Text>
        <TouchableOpacity 
          onPress={() => router.push("/(screens)/(stack)/healthMetrics/AddHealthIndex" as any)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

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
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#666',
  },
});
