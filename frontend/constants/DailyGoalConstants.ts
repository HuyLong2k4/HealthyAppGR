// Goal Categories
export const GoalCategory = {
  HYDRATION: 'HYDRATION',
  RUNNING: 'RUNNING',
  WALKING: 'WALKING',
  CYCLING: 'CYCLING',
  SWIMMING: 'SWIMMING',
  SLEEP: 'SLEEP',
  CUSTOM: 'CUSTOM',
} as const;

export type GoalCategoryType = typeof GoalCategory[keyof typeof GoalCategory];

// Goal Units
export const GoalUnit = {
  CUP: 'CUP',
  ML: 'ML',
  KM: 'KM',
  MIN: 'MIN',
  STEP: 'STEP',
  TIMES: 'TIMES',
} as const;

export type GoalUnitType = typeof GoalUnit[keyof typeof GoalUnit];

// Goal Status
export const GoalStatus = {
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED'
} as const;

export type GoalStatusType = typeof GoalStatus[keyof typeof GoalStatus];

// Category Labels in Vietnamese
export const CategoryLabels: Record<GoalCategoryType, string> = {
  [GoalCategory.HYDRATION]: 'Uống nước',
  [GoalCategory.RUNNING]: 'Chạy bộ',
  [GoalCategory.WALKING]: 'Đi bộ',
  [GoalCategory.CYCLING]: 'Đạp xe',
  [GoalCategory.SWIMMING]: 'Bơi lội',
  [GoalCategory.SLEEP]: 'Giấc ngủ',
  [GoalCategory.CUSTOM]: 'Tùy chỉnh',
};

// Unit Labels in Vietnamese
export const UnitLabels: Record<GoalUnitType, string> = {
  [GoalUnit.CUP]: 'Cốc',
  [GoalUnit.ML]: 'ml',
  [GoalUnit.KM]: 'km',
  [GoalUnit.MIN]: 'phút',
  [GoalUnit.STEP]: 'bước',
  [GoalUnit.TIMES]: 'lần',
};

// Category Icons (using Ionicons names)
export const CategoryIcons: Record<GoalCategoryType, string> = {
  [GoalCategory.HYDRATION]: 'water',
  [GoalCategory.RUNNING]: 'walk',
  [GoalCategory.WALKING]: 'walk-outline',
  [GoalCategory.CYCLING]: 'bicycle',
  [GoalCategory.SWIMMING]: 'water-outline',
  [GoalCategory.SLEEP]: 'bed',
  [GoalCategory.CUSTOM]: 'create',
};

// Category Colors
export const CategoryColors: Record<GoalCategoryType, string> = {
  [GoalCategory.HYDRATION]: '#2196F3',
  [GoalCategory.RUNNING]: '#FF9800',
  [GoalCategory.WALKING]: '#4CAF50',
  [GoalCategory.CYCLING]: '#9C27B0',
  [GoalCategory.SWIMMING]: '#00BCD4',
  [GoalCategory.SLEEP]: '#673AB7',
  [GoalCategory.CUSTOM]: '#607D8B',
};
