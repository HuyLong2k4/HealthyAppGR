export enum HealthIndexType {
  BODY_TEMPERATURE = 'bodyTemperature',
  HEART_RATE = 'heartRate',
  OXYGEN_SATURATION = 'oxygenSaturation',
  RESPIRATORY_RATE = 'respiratoryRate',
  SLEEP = 'sleep',
  STEP_COUNT = 'stepCount'
}

export interface HealthIndexConfig {
  label: string;
  unit: string;
  icon: string;
  color: string;
  min: number;
  max: number;
  defaultValue?: number;
}

export const HealthIndexConfigs: Record<HealthIndexType, HealthIndexConfig> = {
  [HealthIndexType.BODY_TEMPERATURE]: {
    label: 'Nhiệt độ cơ thể',
    unit: '°C',
    icon: 'thermometer',
    color: '#FF6B9D', // Hồng đỏ sáng
    min: 35,
    max: 42,
    defaultValue: 0
  },
  [HealthIndexType.HEART_RATE]: {
    label: 'Nhịp tim',
    unit: 'bpm',
    icon: 'heart',
    color: '#FF3838', // Đỏ tươi
    min: 30,
    max: 220,
    defaultValue: 0
  },
  [HealthIndexType.OXYGEN_SATURATION]: {
    label: 'Độ bão hòa oxy',
    unit: '%',
    icon: 'fitness',
    color: '#00D4FF', // Xanh cyan sáng
    min: 0,
    max: 100,
    defaultValue: 0
  },
  [HealthIndexType.RESPIRATORY_RATE]: {
    label: 'Tần số hô hấp',
    unit: 'lần/phút',
    icon: 'pulse',
    color: '#00E5CC', // Xanh ngọc tươi
    min: 0,
    max: 60,
    defaultValue: 0
  },
  [HealthIndexType.SLEEP]: {
    label: 'Giấc ngủ',
    unit: 'giờ',
    icon: 'moon',
    color: '#A855F7', // Tím sáng
    min: 0,
    max: 24,
    defaultValue: 0
  },
  [HealthIndexType.STEP_COUNT]: {
    label: 'Số bước chân',
    unit: 'bước',
    icon: 'footsteps',
    color: '#10B981', // Xanh lá tươi
    min: 0,
    max: 100000,
    defaultValue: 0
  }
};

export const getAllHealthIndexTypes = (): HealthIndexType[] => {
  return Object.values(HealthIndexType);
};

export const getHealthIndexConfig = (type: HealthIndexType): HealthIndexConfig => {
  return HealthIndexConfigs[type];
};
