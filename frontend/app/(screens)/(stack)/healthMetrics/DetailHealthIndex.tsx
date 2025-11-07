import {
    HealthIndexType,
    getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 200;

type TimeRange = 'day' | 'week' | 'month';

export default function DetailHealthIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { healthIndexes, isLoading } = useHealthIndexes();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const metricType = params.type as HealthIndexType;
  const config = getHealthIndexConfig(metricType);

  // Lấy dữ liệu cho chỉ số này
  const metricData = useMemo(() => {
    if (!healthIndexes || !metricType) return [];

    const fieldMap: Record<HealthIndexType, string> = {
      [HealthIndexType.BODY_TEMPERATURE]: 'bodyTemperature',
      [HealthIndexType.HEART_RATE]: 'heartRate',
      [HealthIndexType.OXYGEN_SATURATION]: 'oxygenSaturation',
      [HealthIndexType.RESPIRATORY_RATE]: 'respiratoryRate',
      [HealthIndexType.SLEEP]: 'sleep',
      [HealthIndexType.STEP_COUNT]: 'stepCount',
    };

    const field = fieldMap[metricType];
    
    return healthIndexes
      .filter((item: any) => item[field] !== undefined && item[field] !== null)
      .map((item: any) => ({
        value: item[field],
        date: new Date(item.recordedTime || item.createdAt),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [healthIndexes, metricType]);

  // Lọc dữ liệu theo time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const ranges = {
      day: 1,
      week: 7,
      month: 30,
    };
    
    const daysAgo = ranges[timeRange];
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return metricData.filter(item => item.date >= cutoffDate);
  }, [metricData, timeRange]);

  // Tính toán thống kê
  const statistics = useMemo(() => {
    if (filteredData.length === 0) {
      return { max: 0, min: 0, avg: 0 };
    }

    const values = filteredData.map(item => item.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    return { max, min, avg };
  }, [filteredData]);

  // Render simple bar chart
  const renderChart = () => {
    if (filteredData.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>Không có dữ liệu</Text>
        </View>
      );
    }

    const maxValue = Math.max(...filteredData.map(d => d.value));
    const minValue = Math.min(...filteredData.map(d => d.value));
    const range = maxValue - minValue || 1;

    const barWidth = Math.min(CHART_WIDTH / filteredData.length - 8, 40);

    return (
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{Math.round(maxValue)}</Text>
          <Text style={styles.axisLabel}>{Math.round((maxValue + minValue) / 2)}</Text>
          <Text style={styles.axisLabel}>{Math.round(minValue)}</Text>
        </View>

        {/* Chart area */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
          <View style={styles.barsContainer}>
            {/* Grid lines */}
            <View style={styles.gridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            {/* Bars */}
            <View style={styles.bars}>
              {filteredData.map((item, index) => {
                const heightPercent = ((item.value - minValue) / range) * 100;
                const height = (heightPercent / 100) * (CHART_HEIGHT - 60);
                
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View style={styles.barColumn}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: height || 10,
                            backgroundColor: config.color,
                            width: barWidth
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.xAxisLabel}>
                      {item.date.getDate()}/{item.date.getMonth() + 1}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={config.color} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.label}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current value */}
        <View style={styles.currentValueCard}>
          <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={32} color="#FFFFFF" />
          </View>
          <View style={styles.currentValueInfo}>
            <Text style={styles.currentValueLabel}>Giá trị hiện tại</Text>
            <Text style={styles.currentValue}>
              {filteredData.length > 0 ? filteredData[filteredData.length - 1].value : '--'}
              <Text style={styles.currentUnit}> {config.unit}</Text>
            </Text>
            <Text style={styles.currentDate}>
              {filteredData.length > 0 
                ? filteredData[filteredData.length - 1].date.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Chưa có dữ liệu'}
            </Text>
          </View>
        </View>

        {/* Time range selector */}
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'day' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('day')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'day' && styles.timeRangeTextActive]}>
              Ngày
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
              Tuần
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'month' && styles.timeRangeTextActive]}>
              Tháng
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Tổng hợp {timeRange === 'day' ? 'ngày' : timeRange === 'week' ? 'tuần' : 'tháng'}</Text>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(statistics.max)} {config.unit}</Text>
            <Text style={styles.statLabel}>Maximum</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(statistics.min)} {config.unit}</Text>
            <Text style={styles.statLabel}>Minimum</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(statistics.avg)} {config.unit}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 40,
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
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  currentValueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  currentValueInfo: {
    flex: 1,
  },
  currentValueLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  currentUnit: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#666',
  },
  currentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingRight: 8,
    height: CHART_HEIGHT - 40,
  },
  axisLabel: {
    fontSize: 10,
    color: '#999',
  },
  chartScroll: {
    flex: 1,
  },
  barsContainer: {
    height: CHART_HEIGHT - 40,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT - 60,
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barColumn: {
    height: CHART_HEIGHT - 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 4,
    minHeight: 5,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
  },
  emptyChart: {
    height: CHART_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyChartText: {
    fontSize: 14,
    color: '#999',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
});
