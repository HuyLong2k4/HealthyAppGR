# GoalWeek API Documentation

API endpoints để quản lý GoalWeeks - tracking tiến độ goal theo tuần.

## Base URL
```
http://localhost:5000/api/goal-weeks
```

## Model Schema

```javascript
{
  goal: ObjectId (ref: Goal) - required,
  weekStart: Date - required,
  weekEnd: Date - required,
  targetTotal: Number - required (> 0),
  achievedTotal: Number - default: 0,
  completionPct: Number - default: 0 (tự động tính),
  status: Enum (OPEN, CLOSED) - default: OPEN,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints

### 1. Tạo GoalWeek mới
```
POST /api/goal-weeks
```

**Body:**
```json
{
  "goal": "673abc123...",
  "weekStart": "2025-11-04T00:00:00.000Z",
  "weekEnd": "2025-11-10T23:59:59.999Z",
  "targetTotal": 56,
  "achievedTotal": 0,
  "note": "Tuần đầu tiên"
}
```

**Response (201):**
```json
{
  "message": "GoalWeek created successfully",
  "goalWeek": {
    "_id": "...",
    "goal": {...},
    "weekStart": "2025-11-04T00:00:00.000Z",
    "weekEnd": "2025-11-10T23:59:59.999Z",
    "targetTotal": 56,
    "achievedTotal": 0,
    "completionPct": 0,
    "status": "OPEN",
    "note": "Tuần đầu tiên",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2. Lấy tất cả GoalWeeks (với filter)
```
GET /api/goal-weeks?goal=<goalId>&status=<OPEN|CLOSED>&startDate=<date>&endDate=<date>
```

**Query Parameters:**
- `goal` (optional): Filter theo Goal ID
- `status` (optional): OPEN, CLOSED
- `startDate` & `endDate` (optional): Lọc theo khoảng thời gian

**Response (200):**
```json
[
  {
    "_id": "...",
    "goal": {
      "_id": "...",
      "name": "Uống nước",
      "category": "HYDRATION",
      ...
    },
    "weekStart": "2025-11-04T00:00:00.000Z",
    "weekEnd": "2025-11-10T23:59:59.999Z",
    "targetTotal": 56,
    "achievedTotal": 28,
    "completionPct": 50,
    "status": "OPEN",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 3. Lấy GoalWeeks theo Goal ID
```
GET /api/goal-weeks/goal/:goalId?status=<OPEN|CLOSED>
```

### 4. Lấy GoalWeek tuần hiện tại của Goal
```
GET /api/goal-weeks/goal/:goalId/current
```

**Response (200):**
```json
{
  "_id": "...",
  "goal": {...},
  "weekStart": "2025-11-04T00:00:00.000Z",
  "weekEnd": "2025-11-10T23:59:59.999Z",
  "targetTotal": 56,
  "achievedTotal": 30,
  "completionPct": 54,
  "status": "OPEN"
}
```

### 5. Lấy hoặc tạo GoalWeek tuần hiện tại
```
POST /api/goal-weeks/goal/:goalId/current
```
**Mô tả:** Tự động tạo GoalWeek cho tuần hiện tại nếu chưa có, dựa trên frequency của Goal.

**Response (200):**
```json
{
  "_id": "...",
  "goal": {...},
  "weekStart": "2025-11-04T00:00:00.000Z",
  "weekEnd": "2025-11-10T23:59:59.999Z",
  "targetTotal": 56,
  "achievedTotal": 0,
  "completionPct": 0,
  "status": "OPEN"
}
```

### 6. Lấy GoalWeek theo ID
```
GET /api/goal-weeks/:id
```

### 7. Cập nhật GoalWeek
```
PUT /api/goal-weeks/:id
```

**Body:**
```json
{
  "targetTotal": 60,
  "note": "Tăng mục tiêu"
}
```

**Response (200):**
```json
{
  "message": "GoalWeek updated successfully",
  "goalWeek": {...}
}
```

### 8. Cập nhật tiến độ (achievedTotal)
```
PATCH /api/goal-weeks/:id/progress
```

**Body:**
```json
{
  "achievedTotal": 35
}
```

**Response (200):**
```json
{
  "message": "Progress updated successfully",
  "goalWeek": {
    "achievedTotal": 35,
    "completionPct": 63,
    ...
  }
}
```

### 9. Tăng tiến độ (increment)
```
PATCH /api/goal-weeks/:id/increment
```

**Body:**
```json
{
  "amount": 1
}
```
**Mô tả:** Tăng achievedTotal thêm 1 (hoặc amount chỉ định). Phù hợp khi user hoàn thành 1 lần (uống 1 cốc nước, chạy 1 lần...)

**Response (200):**
```json
{
  "message": "Progress incremented successfully",
  "goalWeek": {
    "achievedTotal": 36,
    "completionPct": 64,
    ...
  }
}
```

### 10. Đóng GoalWeek
```
PATCH /api/goal-weeks/:id/close
```

**Response (200):**
```json
{
  "message": "GoalWeek closed successfully",
  "goalWeek": {
    "status": "CLOSED",
    ...
  }
}
```

### 11. Mở lại GoalWeek
```
PATCH /api/goal-weeks/:id/reopen
```

**Response (200):**
```json
{
  "message": "GoalWeek reopened successfully",
  "goalWeek": {
    "status": "OPEN",
    ...
  }
}
```

### 12. Xóa GoalWeek
```
DELETE /api/goal-weeks/:id
```

**Response (200):**
```json
{
  "message": "GoalWeek deleted successfully"
}
```

### 13. Lấy thống kê GoalWeeks
```
GET /api/goal-weeks/stats?goal=<goalId>&status=<status>
```

**Response (200):**
```json
{
  "total": 10,
  "open": 1,
  "closed": 9,
  "completed": 7,
  "avgCompletion": 85
}
```

## PowerShell Test Commands

### 1. Tạo GoalWeek
```powershell
$body = @{
    goal = "673abc123..."
    weekStart = "2025-11-04T00:00:00.000Z"
    weekEnd = "2025-11-10T23:59:59.999Z"
    targetTotal = 56
    achievedTotal = 0
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/goal-weeks' -ContentType 'application/json' -Body $body
```

### 2. Lấy GoalWeek tuần hiện tại hoặc tạo mới
```powershell
Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/goal-weeks/goal/673abc123.../current'
```

### 3. Lấy tất cả GoalWeeks của Goal
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goal-weeks/goal/673abc123...'
```

### 4. Cập nhật tiến độ
```powershell
$body = @{
    achievedTotal = 35
} | ConvertTo-Json

Invoke-RestMethod -Method Patch -Uri 'http://localhost:5000/api/goal-weeks/GOALWEEK_ID/progress' -ContentType 'application/json' -Body $body
```

### 5. Tăng tiến độ (increment)
```powershell
$body = @{
    amount = 1
} | ConvertTo-Json

Invoke-RestMethod -Method Patch -Uri 'http://localhost:5000/api/goal-weeks/GOALWEEK_ID/increment' -ContentType 'application/json' -Body $body
```

### 6. Đóng GoalWeek
```powershell
Invoke-RestMethod -Method Patch -Uri 'http://localhost:5000/api/goal-weeks/GOALWEEK_ID/close'
```

### 7. Lấy thống kê
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goal-weeks/stats?goal=673abc123...'
```

### 8. Filter theo thời gian
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goal-weeks?startDate=2025-11-01&endDate=2025-11-30&status=OPEN'
```

## Use Cases

### Case 1: User bắt đầu track goal mới
1. Tạo Goal (POST /api/goals)
2. Tạo hoặc lấy GoalWeek tuần này (POST /api/goal-weeks/goal/:goalId/current)
3. User hoàn thành task → Increment progress (PATCH /api/goal-weeks/:id/increment)

### Case 2: User check tiến độ tuần này
1. Lấy GoalWeek tuần hiện tại (GET /api/goal-weeks/goal/:goalId/current)
2. Hiển thị: achievedTotal / targetTotal (completionPct%)

### Case 3: Xem lịch sử các tuần trước
1. Lấy tất cả GoalWeeks của Goal (GET /api/goal-weeks/goal/:goalId)
2. Filter theo status=CLOSED để xem các tuần đã kết thúc

### Case 4: Dashboard thống kê
1. Lấy stats tổng quan (GET /api/goal-weeks/stats)
2. Lấy stats theo từng goal (GET /api/goal-weeks/stats?goal=:goalId)

## Business Logic

### Auto-calculation
- **completionPct**: Tự động tính = (achievedTotal / targetTotal) * 100
- **weekStart/weekEnd**: Tuần từ thứ 2 00:00:00 đến chủ nhật 23:59:59

### targetTotal Calculation (getOrCreateCurrentWeek)
- Nếu Goal.frequency = DAILY → targetTotal = Goal.quantity × 7
- Nếu Goal.frequency = WEEKLY → targetTotal = Goal.quantity

**Ví dụ:**
- Goal: "Uống 8 cốc nước", frequency=DAILY → targetTotal = 8 × 7 = 56 cốc/tuần
- Goal: "Chạy 30km", frequency=WEEKLY → targetTotal = 30 km/tuần

## Validation Rules

1. **weekEnd** phải sau **weekStart**
2. **targetTotal** phải > 0
3. **achievedTotal** không được âm
4. **goal** phải tồn tại trong database
5. **status** chỉ nhận OPEN hoặc CLOSED
6. Không thể thay đổi **goal** khi update
7. Index unique: (goal + weekStart) - mỗi goal chỉ có 1 GoalWeek cho cùng 1 weekStart

## Error Responses

### 400 Bad Request
```json
{
  "error": "weekEnd phải sau weekStart"
}
```

### 404 Not Found
```json
{
  "message": "GoalWeek not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error message"
}
```

## Features

✅ CRUD đầy đủ  
✅ Auto-create GoalWeek cho tuần hiện tại  
✅ Tính toán completionPct tự động  
✅ Increment progress (cho tracking realtime)  
✅ Filter theo goal, status, date range  
✅ Statistics & analytics  
✅ Open/Close status management  
✅ Populate Goal information  
✅ Unique constraint (goal + weekStart)  
