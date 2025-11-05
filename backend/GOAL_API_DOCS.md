# Goal API Documentation

API endpoints để quản lý Goals (mục tiêu sức khỏe) của người dùng.

## Base URL
```
http://localhost:5000/api/goals
```

## Model Schema

```javascript
{
  user: ObjectId (ref: User) - required,
  name: String - required,
  category: Enum (HYDRATION, RUNNING, WALKING, CYCLING, SWIMMING, SLEEP, CUSTOM) - default: CUSTOM,
  quantity: Number - required (> 0),
  unit: Enum (CUP, ML, KM, MIN, STEP, TIMES) - required,
  frequency: Enum (DAILY, WEEKLY) - default: DAILY,
  isActive: Boolean - default: true,
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints

### 1. Lấy danh sách Enum Values
```
GET /api/goals/enums
```
**Response:**
```json
{
  "categories": ["HYDRATION", "RUNNING", "WALKING", "CYCLING", "SWIMMING", "SLEEP", "CUSTOM"],
  "units": ["CUP", "ML", "KM", "MIN", "STEP", "TIMES"],
  "frequencies": ["DAILY", "WEEKLY"]
}
```

### 2. Tạo Goal mới
```
POST /api/goals
```
**Headers:** Authentication required (Bearer token)

**Body:**
```json
{
  "name": "Uống nước",
  "category": "HYDRATION",
  "quantity": 8,
  "unit": "CUP",
  "frequency": "DAILY",
  "isActive": true
}
```

**Response (201):**
```json
{
  "message": "Goal created successfully",
  "goal": {
    "_id": "...",
    "user": "...",
    "name": "Uống nước",
    "category": "HYDRATION",
    "quantity": 8,
    "unit": "CUP",
    "frequency": "DAILY",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 3. Lấy tất cả Goals (với filter)
```
GET /api/goals?user=<userId>&category=<category>&frequency=<frequency>&isActive=<true/false>
```

**Query Parameters:**
- `user` (optional): Filter theo user ID
- `category` (optional): HYDRATION, RUNNING, WALKING, CYCLING, SWIMMING, SLEEP, CUSTOM
- `frequency` (optional): DAILY, WEEKLY
- `isActive` (optional): true, false

**Response (200):**
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "username": "john_doe",
      "imageURL": "...",
      "email": "john@example.com"
    },
    "name": "Uống nước",
    "category": "HYDRATION",
    "quantity": 8,
    "unit": "CUP",
    "frequency": "DAILY",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### 4. Lấy Goals theo User ID
```
GET /api/goals/user/:userId?category=<category>&isActive=<true/false>
```

### 5. Lấy Goals Active của User
```
GET /api/goals/user/:userId/active
```

### 6. Lấy Goal theo ID
```
GET /api/goals/:id
```

**Response (200):**
```json
{
  "_id": "...",
  "user": {...},
  "name": "Chạy bộ",
  "category": "RUNNING",
  "quantity": 5,
  "unit": "KM",
  "frequency": "DAILY",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 7. Cập nhật Goal
```
PUT /api/goals/:id
```
**Headers:** Authentication required (chỉ owner hoặc admin)

**Body:**
```json
{
  "quantity": 10,
  "isActive": false
}
```

**Response (200):**
```json
{
  "message": "Goal updated successfully",
  "goal": {...}
}
```

### 8. Toggle Active Status
```
PATCH /api/goals/:id/toggle
```

**Response (200):**
```json
{
  "message": "Goal status toggled successfully",
  "goal": {...}
}
```

### 9. Xóa Goal
```
DELETE /api/goals/:id?soft=<true/false>
```
**Headers:** Authentication required (chỉ owner hoặc admin)

**Query Parameters:**
- `soft` (optional): true = soft delete (set isActive=false), false = hard delete

**Response (200):**
```json
{
  "message": "Goal deleted successfully"
}
```

### 10. Đếm số Goals
```
GET /api/goals/stats/count?user=<userId>&category=<category>&isActive=<true/false>
```

**Response (200):**
```json
{
  "count": 5
}
```

## PowerShell Test Commands

### 1. Lấy Enums
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals/enums'
```

### 2. Tạo Goal (cần token nếu có authentication)
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

$body = @{
    name = "Uống nước"
    category = "HYDRATION"
    quantity = 8
    unit = "CUP"
    frequency = "DAILY"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/goals' -Headers $headers -Body $body
```

### 3. Lấy tất cả Goals
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals'
```

### 4. Lấy Goals của User
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals/user/USER_ID_HERE'
```

### 5. Filter Goals theo category
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals?category=HYDRATION&isActive=true'
```

### 6. Lấy Goal theo ID
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals/GOAL_ID_HERE'
```

### 7. Cập nhật Goal
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

$body = @{
    quantity = 10
    isActive = $false
} | ConvertTo-Json

Invoke-RestMethod -Method Put -Uri 'http://localhost:5000/api/goals/GOAL_ID_HERE' -Headers $headers -Body $body
```

### 8. Toggle Active
```powershell
Invoke-RestMethod -Method Patch -Uri 'http://localhost:5000/api/goals/GOAL_ID_HERE/toggle'
```

### 9. Soft Delete
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Method Delete -Uri 'http://localhost:5000/api/goals/GOAL_ID_HERE?soft=true' -Headers $headers
```

### 10. Đếm Goals
```powershell
Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/goals/stats/count?isActive=true'
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Quantity phải lớn hơn 0"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required."
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to update this goal"
}
```

### 404 Not Found
```json
{
  "message": "Goal not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error message"
}
```

## Validation Rules

1. **name**: Bắt buộc, không rỗng
2. **quantity**: Bắt buộc, phải > 0
3. **unit**: Bắt buộc, phải thuộc enum GoalUnit
4. **category**: Optional, phải thuộc enum GoalCategory (default: CUSTOM)
5. **frequency**: Optional, phải thuộc enum GoalFrequency (default: DAILY)
6. **user**: Tự động gán từ authentication token

## Features

✅ CRUD đầy đủ (Create, Read, Update, Delete)  
✅ Populate user information  
✅ Filter theo category, frequency, isActive  
✅ Soft delete support  
✅ Ownership check (chỉ owner hoặc admin mới sửa/xóa)  
✅ Validation đầy đủ cho enum values  
✅ Toggle active status  
✅ Count statistics  
✅ Get enum values endpoint  
