# Test Security Fix - Chat Context

## Vấn đề đã được phát hiện:
User A có thể xem được chat của User B do race condition và stale closure values.

## Các fix đã implement:

### 1. Frontend (ChatContext.js)

#### Fix #1: AbortController & Cleanup
- Thêm `AbortController` để cancel requests cũ khi userId thay đổi
- Thêm `isCurrentRequest` flag để ignore stale responses
- Thêm cleanup function trong useEffect

#### Fix #2: Current Value Capture
- Trong `sendMessage`, capture `currentUserId` và `currentToken` TẠI THỜI ĐIỂM gửi
- KHÔNG dùng closure values có thể đã cũ
- Áp dụng cho cả `clearChat` function

#### Fix #3: Ref Tracking
- Thêm `currentUserIdRef` để track userId hiện tại
- Update ref mỗi khi userId thay đổi

#### Fix #4: Response Validation
- Validate userId trong response có khớp với userId hiện tại
- Log warning nếu phát hiện mismatch
- Reject và clear messages nếu detect security issue

### 2. Backend

#### Fix #1: Security Validation trong Controller
- Validate tất cả messages trả về thuộc về user đang request
- Return error 500 nếu detect data breach
- Thêm extensive logging

#### Fix #2: Sort Order Fix
- Messages được sort theo thứ tự chronological (cũ -> mới)

## Test Cases cần thực hiện:

### Test 1: Normal Flow
1. User A login
2. User A chat với AI
3. Verify messages được lưu đúng
4. Logout
5. User B login
6. Verify User B chỉ thấy messages của mình

### Test 2: Fast Switch
1. User A login và chat
2. Ngay lập tức logout và login User B
3. Verify không có messages của User A hiển thị cho User B

### Test 3: Concurrent Requests
1. User A đang chat (request pending)
2. User A logout
3. User B login ngay lập tức
4. Verify response từ request cũ bị reject

### Test 4: Token Validation
1. User A login, lấy token
2. User B login (invalidate token A)
3. User A thử chat với token cũ
4. Verify backend reject request

## Cách test:

### Backend Logs cần check:
```
[getRecentMessages] Loading messages for user: <userId>
[getRecentMessages] Returning X messages for user: <userId>
[sendMessage] Sending message for user: <userId>
[sendMessage] Saving chat to backend for user: <userId>
```

### Frontend Logs cần check:
```
[ChatContext] User changed to: <userId>
Loading chat for userId: <userId>
[sendMessage] Sending message for user: <userId>
[sendMessage] Chat saved successfully for user: <userId>
```

### Security Warnings cần monitor:
```
⚠️ SECURITY WARNING: Received messages for different user!
⚠️ SECURITY ERROR: Found X messages not belonging to user <userId>
```

## Commands để test:

### 1. Xem backend logs:
```bash
cd backend
npm start
# Monitor console logs
```

### 2. Xem frontend logs:
```bash
cd frontend
npx expo start
# Mở React Native Debugger để xem console
```

### 3. Test với curl (backend API):
```bash
# Login User A
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"userA@test.com","password":"password"}'

# Lưu token A
TOKEN_A="<token_from_response>"

# Send chat
curl -X POST http://localhost:5000/api/messages/chat \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"Hello","aiResponse":"Hi there"}'

# Login User B
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"userB@test.com","password":"password"}'

TOKEN_B="<token_from_response>"

# Get messages của User B (phải rỗng hoặc chỉ có của B)
curl -X GET http://localhost:5000/api/messages/recent \
  -H "Authorization: Bearer $TOKEN_B"
```

## Expected Results:

✅ User B không thấy messages của User A
✅ Mỗi user chỉ thấy messages của chính mình
✅ Không có security warnings trong logs
✅ Race conditions được handle đúng
✅ Token cũ không thể access data mới

## Nếu vẫn có vấn đề:

### Kiểm tra thêm:
1. Verify authMiddleware đang decode đúng userId từ token
2. Kiểm tra database xem messages có đúng user field không
3. Verify không có caching layer nào cache sai data
4. Check xem có multiple instances của ChatContext không
5. Verify AsyncStorage key không bị trùng lặp

### Debug commands:
```javascript
// Thêm vào ChatContext để debug:
useEffect(() => {
  console.log('[DEBUG] Current state:', {
    userId,
    token: token ? 'exists' : 'null',
    messagesCount: messages.length,
    refUserId: currentUserIdRef.current
  });
}, [userId, token, messages.length]);
```
