import {
  HealthIndexType,
  getAllHealthIndexTypes,
  getHealthIndexConfig
} from '@/constants/HealthIndexConstants';
import { useHealthIndexes } from '@/context/HealthIndexContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
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
  const { createHealthIndex } = useHealthIndexes();

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm chỉ số sức khỏe</Text>
        <TouchableOpacity 
          onPress={() => setValues(getDefaultValues())} 
          style={styles.resetButton}
        >
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

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
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Lưu chỉ số sức khỏe</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
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
  resetButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    lineHeight: 20,
  },
  inputField: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  requiredMark: {
    color: '#FF5252',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fieldRange: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
  },
  inputContainerEmpty: {
    borderColor: '#FFA726',
    backgroundColor: '#FFF3E0',
  },
  inputContainerError: {
    borderColor: '#FF5252',
    backgroundColor: '#FFEBEE',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  inputUnit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
    minWidth: 40,
  },
  errorText: {
    fontSize: 12,
    color: '#FF5252',
    marginTop: 4,
    marginLeft: 48,
  },
  requiredText: {
    fontSize: 12,
    color: '#FFA726',
    marginTop: 4,
    marginLeft: 48,
    fontStyle: 'italic',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
