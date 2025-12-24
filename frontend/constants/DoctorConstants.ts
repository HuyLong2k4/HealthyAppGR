// Specialty constants matching backend
export const SpecialtyType = {
  CARDIOLOGY: 'CARDIOLOGY',
  RESPIRATORY: 'RESPIRATORY',
  GENERAL: 'GENERAL',
  NEUROLOGY: 'NEUROLOGY',
  NUTRITION: 'NUTRITION',
} as const;

export const SpecialtyLabels: Record<string, string> = {
  CARDIOLOGY: 'Tim mạch',
  RESPIRATORY: 'Hô hấp',
  GENERAL: 'Tổng quát',
  NEUROLOGY: 'Thần kinh',
  NUTRITION: 'Dinh dưỡng',
};

export const SpecialtyColors: Record<string, string> = {
  CARDIOLOGY: '#dc3545',
  RESPIRATORY: '#007bff',
  GENERAL: '#28a745',
  NEUROLOGY: '#6f42c1',
  NUTRITION: '#fd7e14',
};

// Title constants matching backend
export const DoctorTitle = {
  BS: 'BS',
  ThS_BS: 'ThS.BS',
  TS_BS: 'TS.BS',
  PGS_TS: 'PGS.TS',
  GS_TS: 'GS.TS',
} as const;

export const TitleLabels: Record<string, string> = {
  'BS': 'Bác sĩ',
  'ThS.BS': 'Thạc sĩ - Bác sĩ',
  'TS.BS': 'Tiến sĩ - Bác sĩ',
  'PGS.TS': 'Phó Giáo sư - Tiến sĩ',
  'GS.TS': 'Giáo sư - Tiến sĩ',
};

// Days of week
export const DaysOfWeek: Record<number, string> = {
  0: 'Chủ nhật',
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
};
