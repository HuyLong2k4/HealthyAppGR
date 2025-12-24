// Appointment Status constants matching backend
export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const AppointmentStatusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang diễn ra',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const AppointmentStatusColors: Record<string, string> = {
  PENDING: '#ffc107',      // Amber - Chờ xác nhận
  CONFIRMED: '#007bff',    // Blue - Đã xác nhận
  IN_PROGRESS: '#17a2b8',  // Cyan - Đang diễn ra
  COMPLETED: '#28a745',    // Green - Hoàn thành
  CANCELLED: '#dc3545',    // Red - Đã hủy
};

// Specialty (reuse from DoctorConstants)
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
