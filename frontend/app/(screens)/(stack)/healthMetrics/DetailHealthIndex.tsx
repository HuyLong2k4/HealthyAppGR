import {
  HealthIndexType,
  getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
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
    
    if (timeRange === 'day') {
      // Ngày: Lọc chỉ hôm nay
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      return metricData.filter(item => item.date >= startOfDay);
    } else if (timeRange === 'week') {
      // Tuần: Lấy 7 ngày gần nhất, nhóm theo ngày và lấy max
      const cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekData = metricData.filter(item => item.date >= cutoffDate);
      
      // Nhóm theo ngày
      const groupedByDay: { [key: string]: { value: number; date: Date }[] } = {};
      weekData.forEach(item => {
        const dateKey = `${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDate()}`;
        if (!groupedByDay[dateKey]) {
          groupedByDay[dateKey] = [];
        }
        groupedByDay[dateKey].push(item);
      });
      
      // Lấy giá trị max của mỗi ngày
      return Object.keys(groupedByDay).map(dateKey => {
        const dayData = groupedByDay[dateKey];
        const maxItem = dayData.reduce((max, item) => item.value > max.value ? item : max);
        return maxItem;
      }).sort((a, b) => a.date.getTime() - b.date.getTime());
    } else {
      // Tháng: Lấy 12 tháng gần nhất, nhóm theo tháng và lấy max
      const cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      const monthData = metricData.filter(item => item.date >= cutoffDate);
      
      // Nhóm theo tháng
      const groupedByMonth: { [key: string]: { value: number; date: Date }[] } = {};
      monthData.forEach(item => {
        const monthKey = `${item.date.getFullYear()}-${item.date.getMonth()}`;
        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = [];
        }
        groupedByMonth[monthKey].push(item);
      });
      
      // Lấy giá trị max của mỗi tháng
      return Object.keys(groupedByMonth).map(monthKey => {
        const monthDataItems = groupedByMonth[monthKey];
        const maxItem = monthDataItems.reduce((max, item) => item.value > max.value ? item : max);
        return maxItem;
      }).sort((a, b) => a.date.getTime() - b.date.getTime());
    }
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
                const height = (heightPercent / 100) * (CHART_HEIGHT - 20);
                
                // Format label dựa theo time range
                let label = '';
                if (timeRange === 'day') {
                  // Hiển thị giờ:phút
                  label = `${item.date.getHours()}:${item.date.getMinutes().toString().padStart(2, '0')}`;
                } else if (timeRange === 'week') {
                  // Hiển thị ngày/tháng
                  label = `${item.date.getDate()}/${item.date.getMonth() + 1}`;
                } else {
                  // Hiển thị tháng/năm
                  label = `T${item.date.getMonth() + 1}`;
                }
                
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
                      {label}
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
      <StatusBar barStyle="light-content" backgroundColor={config.color} translucent />
      {/* Header */}
      <LinearGradient
        colors={[config.color, config.color + 'dd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.label}</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current value */}
        <View style={styles.currentValueCard}>
          <LinearGradient
            colors={[config.color, config.color + 'cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name={config.icon as any} size={36} color="#fff" />
          </LinearGradient>
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
            activeOpacity={0.7}
          >
            {timeRange === 'day' && (
              <LinearGradient
                colors={[config.color, config.color + 'dd']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timeRangeGradient}
              />
            )}
            <Text style={[styles.timeRangeText, timeRange === 'day' && styles.timeRangeTextActive]}>
              Ngày
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'week' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('week')}
            activeOpacity={0.7}
          >
            {timeRange === 'week' && (
              <LinearGradient
                colors={[config.color, config.color + 'dd']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timeRangeGradient}
              />
            )}
            <Text style={[styles.timeRangeText, timeRange === 'week' && styles.timeRangeTextActive]}>
              Tuần
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === 'month' && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange('month')}
            activeOpacity={0.7}
          >
            {timeRange === 'month' && (
              <LinearGradient
                colors={[config.color, config.color + 'dd']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timeRangeGradient}
              />
            )}
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
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  currentValueInfo: {
    flex: 1,
  },
  currentValueLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  currentValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  currentUnit: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#64748b',
  },
  currentDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  timeRangeButtonActive: {
    // gradient will be rendered
  },
  timeRangeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timeRangeText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
    zIndex: 1,
  },
  timeRangeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingRight: 10,
    height: CHART_HEIGHT - 35,
  },
  axisLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  chartScroll: {
    flex: 1,
  },
  barsContainer: {
    height: CHART_HEIGHT,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT - 8,
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barColumn: {
    height: CHART_HEIGHT - 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 6,
    minHeight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
    fontWeight: '500',
  },
  emptyChart: {
    height: CHART_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyChartText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  statItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
