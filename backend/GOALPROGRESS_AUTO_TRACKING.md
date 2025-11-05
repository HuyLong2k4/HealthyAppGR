# GoalProgress - Automatic Daily Tracking System

## Tổng quan

Khi một **GoalWeek** được tạo, hệ thống **tự động tạo 7 bản ghi GoalProgress** (một cho mỗi ngày trong tuần từ Thứ 2 đến Chủ nhật) để tracking tiến độ từng ngày.

## Luồng hoạt động

### 1. Tạo GoalWeek → Tự động tạo 7 GoalProgress

```javascript
// User tạo GoalWeek
POST /api/goal-weeks
{
  "goal": "673abc...",
  "weekStart": "2025-11-04T00:00:00.000Z",  // Thứ 2
  "weekEnd": "2025-11-10T23:59:59.999Z",     // Chủ nhật
  "targetTotal": 56
}

// Hệ thống tự động:
// 1. Tạo GoalWeek
// 2. Tạo 7 GoalProgress:
//    - Ngày 1 (Thứ 2): targetDate = 2025-11-04, actualQuantity = 0, status = OPEN
//    - Ngày 2 (Thứ 3): targetDate = 2025-11-05, actualQuantity = 0, status = OPEN
//    - Ngày 3 (Thứ 4): targetDate = 2025-11-06, actualQuantity = 0, status = OPEN
//    - Ngày 4 (Thứ 5): targetDate = 2025-11-07, actualQuantity = 0, status = OPEN
//    - Ngày 5 (Thứ 6): targetDate = 2025-11-08, actualQuantity = 0, status = OPEN
//    - Ngày 6 (Thứ 7): targetDate = 2025-11-09, actualQuantity = 0, status = OPEN
//    - Ngày 7 (CN):     targetDate = 2025-11-10, actualQuantity = 0, status = OPEN
```

### 2. Get or Create Current Week → Tự động tạo 7 GoalProgress

```javascript
// User request tuần hiện tại
POST /api/goal-weeks/goal/:goalId/current

// Nếu chưa có GoalWeek cho tuần này:
// 1. Tạo GoalWeek tự động (dựa trên Goal.frequency)
// 2. Tạo 7 GoalProgress cho 7 ngày
```

### 3. Xóa GoalWeek → Tự động xóa các GoalProgress

```javascript
// User xóa GoalWeek
DELETE /api/goal-weeks/:id

// Hệ thống tự động:
// 1. Xóa tất cả GoalProgress liên quan (7 bản ghi)
// 2. Xóa GoalWeek
```

## Model Schema

### GoalProgress
```javascript
{
  goal: ObjectId (ref: Goal) - required,
  goalWeek: ObjectId (ref: GoalWeek) - required,
  targetDate: Date - required (ngày cụ thể trong tuần),
  status: Enum (OPEN, COMPLETED) - default: OPEN,
  actualQuantity: Number - default: 0,
  createdAt: Date,
  updatedAt: Date
}
```

**Index unique**: `(goal + targetDate)` - Mỗi goal chỉ có 1 bản ghi cho 1 ngày cụ thể

## Use Case Example

### Ví dụ: Goal "Uống 8 cốc nước/ngày"

```javascript
// 1. Tạo Goal
POST /api/goals
{
  "name": "Uống nước",
  "category": "HYDRATION",
  "quantity": 8,
  "unit": "CUP",
  "frequency": "DAILY"
}
// => Goal ID: 673abc...

// 2. Tạo hoặc lấy GoalWeek tuần này
POST /api/goal-weeks/goal/673abc.../current
// => Tự động tạo:
//    - GoalWeek: targetTotal = 8 * 7 = 56 cốc/tuần
//    - 7 GoalProgress (Thứ 2 - CN), mỗi ngày actualQuantity = 0

// 3. User uống 1 cốc nước hôm nay (Thứ 3)
// Lấy GoalProgress của ngày hôm nay
GET /api/goal-progress/goal/673abc.../date/2025-11-05
// => GoalProgress ID: 789xyz...

// Tăng actualQuantity +1
PATCH /api/goal-progress/789xyz.../increment
{
  "amount": 1
}
// => actualQuantity: 0 + 1 = 1

// 4. User uống thêm 7 cốc nữa trong ngày
// Gọi API increment 7 lần hoặc:
PATCH /api/goal-progress/789xyz.../quantity
{
  "actualQuantity": 8
}
// => actualQuantity: 8
// => Status tự động chuyển sang COMPLETED (nếu đủ target)

// 5. Xem tiến độ cả tuần
GET /api/goal-progress/goalweek/GOALWEEK_ID
// => [
//      { targetDate: Thứ 2, actualQuantity: 8, status: COMPLETED },
//      { targetDate: Thứ 3, actualQuantity: 8, status: COMPLETED },
//      { targetDate: Thứ 4, actualQuantity: 5, status: OPEN },
//      { targetDate: Thứ 5, actualQuantity: 0, status: OPEN },
//      { targetDate: Thứ 6, actualQuantity: 0, status: OPEN },
//      { targetDate: Thứ 7, actualQuantity: 0, status: OPEN },
//      { targetDate: CN,    actualQuantity: 0, status: OPEN }
//    ]
```

## Implementation Details

### GoalProgressService.createWeeklyProgress()

```javascript
static async createWeeklyProgress(goalId, goalWeekId, weekStart) {
  const progressRecords = [];
  const startDate = new Date(weekStart);

  // Tạo 7 bản ghi cho 7 ngày (Thứ 2 - Chủ nhật)
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + i);
    targetDate.setHours(0, 0, 0, 0);

    progressRecords.push({
      goal: goalId,
      goalWeek: goalWeekId,
      targetDate,
      status: 'OPEN',
      actualQuantity: 0
    });
  }

  return await GoalProgress.insertMany(progressRecords);
}
```

### GoalWeekService.createGoalWeek() - Updated

```javascript
static async createGoalWeek(data) {
  // ... validation ...

  const savedGoalWeek = await newGoalWeek.save();

  // ✅ TỰ ĐỘNG TẠO 7 GOALPROGRESSS
  try {
    await GoalProgressService.createWeeklyProgress(
      data.goal,
      savedGoalWeek._id,
      data.weekStart
    );
    console.log(`✅ Đã tạo 7 bản ghi GoalProgress`);
  } catch (error) {
    console.error('❌ Lỗi khi tạo GoalProgress:', error.message);
  }

  return savedGoalWeek;
}
```

## Benefits

✅ **Tự động hóa hoàn toàn**: User không cần tạo GoalProgress thủ công  
✅ **Consistency**: Luôn có đủ 7 ngày tracking  
✅ **Easy tracking**: Frontend chỉ cần increment actualQuantity  
✅ **Cascade delete**: Xóa GoalWeek → tự động xóa GoalProgress  
✅ **Performance**: Bulk insert 7 records cùng lúc  

## Next Steps

Nếu muốn thêm GoalProgress API endpoints, cần:

1. **Controller**: `goalProgressController.js`
2. **Routes**: `goalProgressRoutes.js`
3. **Register** trong `index.js`: `app.use('/api/goal-progress', goalProgressRoutes)`

Các endpoints cần thiết:
- `GET /api/goal-progress/goalweek/:goalWeekId` - Lấy 7 ngày của tuần
- `GET /api/goal-progress/goal/:goalId/date/:date` - Lấy progress 1 ngày cụ thể
- `PATCH /api/goal-progress/:id/increment` - Tăng actualQuantity
- `PATCH /api/goal-progress/:id/quantity` - Set actualQuantity
- `PATCH /api/goal-progress/:id/complete` - Đánh dấu hoàn thành

Bạn có muốn tôi tạo đầy đủ CRUD cho GoalProgress không?
