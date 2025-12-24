import {
  HealthIndexType,
  getAllHealthIndexTypes,
  getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface HealthIndexValues {
  bodyTemperature: string;
  heartRate: string;
  oxygenSaturation: string;
  respiratoryRate: string;
  sleep: string;
  stepCount: string;
}

export default function AddHealthIndex() {
  const router = useRouter();
  const { createHealthIndex, refreshHealthIndexes } = useHealthIndexes();

  const getDefaultValues = (): HealthIndexValues => {
    const allTypes = getAllHealthIndexTypes();
    const defaults: any = {};
    allTypes.forEach(type => {
      const config = getHealthIndexConfig(type);
      defaults[type] = config.defaultValue?.toString() || '';
    });
    return defaults;
  };

  const [values, setValues] = useState<HealthIndexValues>(getDefaultValues());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (type: HealthIndexType, value: string) => {
    setValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const validateValue = (type: HealthIndexType, value: string): boolean => {
    if (!value || value.trim() === '') return false;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    
    const config = getHealthIndexConfig(type);
    return numValue >= config.min && numValue <= config.max;
  };

  const handleSubmit = async () => {
    const allTypes = getAllHealthIndexTypes();
    
    for (const type of allTypes) {
      const value = values[type as keyof HealthIndexValues];
      if (!value || value.trim() === '') {
        const config = getHealthIndexConfig(type);
        Alert.alert('Lỗi', `Vui lòng nhập ${config.label}`);
        return;
      }
    }

    for (const type of allTypes) {
      const value = values[type as keyof HealthIndexValues];
      if (!validateValue(type, value)) {
        const config = getHealthIndexConfig(type);
        Alert.alert(
          'Lỗi',
          `${config.label} phải nằm trong khoảng ${config.min} - ${config.max} ${config.unit}`
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const indexData = {
        recordedTime: new Date().toISOString(),
        bodyTemperature: parseFloat(values.bodyTemperature),
        heartRate: parseFloat(values.heartRate),
        oxygenSaturation: parseFloat(values.oxygenSaturation),
        respiratoryRate: parseFloat(values.respiratoryRate),
        sleep: parseFloat(values.sleep),
        stepCount: parseFloat(values.stepCount)
      };

      console.log('Chuẩn bị tạo health index:', indexData);

      await createHealthIndex(indexData);
      
      console.log('Tạo health index thành công!');
      
      // Refresh data trước khi quay lại
      await refreshHealthIndexes();
      
      Alert.alert('Thành công', 'Chỉ số sức khỏe đã được thêm', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    } catch (error) {
      console.error('Error creating health index:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm chỉ số sức khỏe. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = (type: HealthIndexType) => {
    const config = getHealthIndexConfig(type);
    const value = values[type as keyof HealthIndexValues];
    const isValid = validateValue(type, value);
    const isEmpty = !value || value.trim() === '';

    return (
      <View key={type} style={styles.inputField}>
        <View style={styles.fieldHeader}>
          <View style={[styles.fieldIcon, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldLabel}>
              {config.label} <Text style={styles.requiredMark}>*</Text>
            </Text>
            <Text style={styles.fieldRange}>
              {config.min} - {config.max} {config.unit}
            </Text>
          </View>
        </View>
        <View style={[
          styles.inputContainer,
          isEmpty && styles.inputContainerEmpty,
          !isValid && !isEmpty && styles.inputContainerError
        ]}>
          <TextInput
            style={styles.input}
            placeholder={`Nhập ${config.label.toLowerCase()}`}
            value={value}
            onChangeText={(text) => updateValue(type, text)}
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputUnit}>{config.unit}</Text>
        </View>
        {!isValid && !isEmpty && (
          <Text style={styles.errorText}>
            Giá trị phải từ {config.min} đến {config.max}
          </Text>
        )}
        {isEmpty && (
          <Text style={styles.requiredText}>
            Trường này là bắt buộc
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" translucent />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm chỉ số sức khỏe</Text>
        <TouchableOpacity 
          onPress={() => setValues(getDefaultValues())} 
          style={styles.resetButton}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Vui lòng nhập đầy đủ tất cả các chỉ số sức khỏe. Tất cả các trường đều bắt buộc.
          </Text>
        </View>

        {/* All Input Fields */}
        {getAllHealthIndexTypes().map(type => renderInputField(type))}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButtonWrapper}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSubmitting ? ['#9e9e9e', '#757575'] : ['#43e97b', '#38f9d7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Lưu chỉ số sức khỏe</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 36,
    shadowColor: '#4facfe',
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
  resetButton: {
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4facfe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    marginLeft: 12,
    lineHeight: 21,
  },
  inputField: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 3,
  },
  requiredMark: {
    color: '#f43f5e',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fieldRange: {
    fontSize: 13,
    color: '#64748b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerEmpty: {
    borderColor: '#fb923c',
    backgroundColor: '#fff7ed',
  },
  inputContainerError: {
    borderColor: '#f43f5e',
    backgroundColor: '#fff1f2',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  inputUnit: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 8,
    minWidth: 45,
  },
  errorText: {
    fontSize: 12,
    color: '#f43f5e',
    marginTop: 6,
    marginLeft: 54,
    fontWeight: '500',
  },
  requiredText: {
    fontSize: 12,
    color: '#fb923c',
    marginTop: 6,
    marginLeft: 54,
    fontStyle: 'italic',
  },
  submitButtonWrapper: {
    marginTop: 12,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButton: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});
