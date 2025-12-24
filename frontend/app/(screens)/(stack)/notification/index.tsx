import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
// Import đúng Context bạn vừa sửa xong
import { NotificationContext } from "@/context/NotificationContext";

const NotificationScreen = () => {
  const router = useRouter();
  
  // Lấy data và hàm từ NotificationContext
  const { notification, isLoading, fetchAllNotification, deleteNotification } = useContext(NotificationContext);
  
  // State riêng cho việc kéo xuống để refresh (khác với isLoading của context)
  const [refreshing, setRefreshing] = useState(false);

  // Load dữ liệu khi vào màn hình
  useEffect(() => {
    fetchAllNotification();
  }, []);

  // Xử lý khi kéo xuống (Pull to Refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllNotification();
    setRefreshing(false);
  }, []);

  // Xử lý xóa thông báo
  const handleDelete = (id) => {
    Alert.alert(
      "Xóa thông báo",
      "Bạn có chắc chắn muốn xóa thông báo này?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: async () => {
            await deleteNotification(id);
          }
        }
      ]
    );
  };

  // Format ngày giờ Việt Nam
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Logic chọn Icon và Màu sắc dựa trên Enum Type (NORMAL / WARNING)
  const getIconConfig = (type) => {
    if (type === 'WARNING') {
      return { 
        icon: 'warning', 
        color: '#FF9800', // Cam
        bgColor: '#FFF3E0',
        label: 'Cảnh báo'
      };
    }
    // Mặc định là NORMAL
    return { 
      icon: 'notifications', 
      color: '#4285F4', // Xanh dương chủ đạo
      bgColor: '#E8F0FE',
      label: 'Thông báo'
    };
  };

  // Render từng item trong danh sách
  const renderItem = ({ item }) => {
    const config = getIconConfig(item.type);

    return (
      <View style={styles.card}>
        {/* Cột Icon bên trái */}
        <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>
        
        {/* Cột Nội dung ở giữa */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
          </View>
          
          {/* Payload là String (theo Model của bạn) */}
          <Text style={styles.message} numberOfLines={3}>
            {item.payload}
          </Text>
        </View>

        {/* Cột Nút xóa bên phải */}
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    );
  };

  // Giao diện khi danh sách trống
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <FontAwesome5 name="bell-slash" size={40} color="#A0AEC0" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
      <Text style={styles.emptyText}>Bạn sẽ nhận được thông báo khi có lịch khám hoặc cảnh báo sức khỏe mới.</Text>
      
      <TouchableOpacity style={styles.refreshButton} onPress={fetchAllNotification}>
        <Text style={styles.refreshButtonText}>Làm mới trang</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Custom giống HomeScreen */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Logic hiển thị List */}
      {isLoading && !refreshing && notification.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      ) : (
        <FlatList
          data={notification}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={["#4285F4"]} 
              tintColor="#4285F4"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA", // Màu nền xám nhạt giống HomeScreen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50, // Chừa chỗ cho Status Bar
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    // Hiệu ứng bóng đổ nhẹ cho Header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Style cho từng Card thông báo
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15, // Bo góc 15 giống HomeScreen
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    // Shadow style chuẩn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Hình tròn
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 11,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  message: {
    fontSize: 14,
    color: "#718096",
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Style cho Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#4285F4",
    borderRadius: 25,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  refreshButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  }
});

export default NotificationScreen;