import { useCourse } from "@/context/CourseContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminUpdatePage = () => {
    // 1. Lấy ID từ URL (ví dụ: /admin/course/update/123)
    const { id } = useLocalSearchParams();

    // 2. Lấy state và hàm từ Context
    const {
        courses,
        isLoading: isContextLoading, // Đổi tên để tránh nhầm lẫn
        updateCourse,
        deleteCourse,
        refreshCourses,
    } = useCourse();

    // 3. State cho form (lưu trữ giá trị người dùng nhập)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [currentCourse, setCurrentCourse] = useState(null);

    // State cho các hành động (cập nhật, xóa)
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // 4. Tự động điền form khi tìm thấy khóa học
    useEffect(() => {
        if (!isContextLoading && courses.length > 0) {
            // Tìm khóa học tương ứng với 'id'
            const courseToUpdate = courses.find((c) => c._id === id);
            if (courseToUpdate) {
                setCurrentCourse(courseToUpdate);
                // Điền dữ liệu cũ vào state của form
                setTitle(courseToUpdate.title || "");
                setDescription(courseToUpdate.description || "");
                setThumbnail(courseToUpdate.thumbnail || "");
            }
        }
    }, [id, courses, isContextLoading]); // Chạy lại khi id hoặc 'courses' thay đổi

    // 5. Hàm xử lý Cập nhật
    const handleUpdate = async () => {
        if (!title) {
            Alert.alert("Lỗi", "Vui lòng nhập tiêu đề khóa học.");
            return;
        }
        setIsUpdating(true);
        const updatedData = {
            title,
            description,
            thumbnail,
        };

        const success = await updateCourse(id, updatedData);
        if (success) {
            Alert.alert("Thành công", "Cập nhật khóa học thành công!");
            refreshCourses(); // Tải lại danh sách (trang list)
            router.back(); // Quay về trang danh sách
        } else {
            Alert.alert("Lỗi", "Cập nhật khóa học thất bại.");
        }
        setIsUpdating(false);
    };

    // 6. Hàm xử lý Xóa (tương tự trang List)
    const handleDelete = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa khóa học này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        setIsDeleting(true);
                        const success = await deleteCourse(id);
                        if (success) {
                            Alert.alert("Đã xóa", "Xóa khóa học thành công.");
                            refreshCourses();
                            router.back();
                        } else {
                            Alert.alert("Lỗi", "Xóa khóa học thất bại.");
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    // --- Render ---

    // Hiển thị loading nếu context đang tải hoặc chưa tìm thấy khóa học
    if (isContextLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    // Hiển thị lỗi nếu không tìm thấy khóa học
    if (!currentCourse) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={styles.emptyText}>Không tìm thấy khóa học.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: "#007AFF" }}>Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Hiển thị form nếu đã có dữ liệu
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {/* Thanh Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.headerButton}>Hủy</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chỉnh sửa</Text>
                    <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
                        <Text style={[styles.headerButton, styles.deleteText]}>
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nội dung Form */}
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.form}>
                        <Text style={styles.label}>Tiêu đề khóa học *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ví dụ: Lập trình React Native"
                        />

                        <Text style={styles.label}>URL ảnh bìa (Thumbnail)</Text>
                        <TextInput
                            style={styles.input}
                            value={thumbnail}
                            onChangeText={setThumbnail}
                            placeholder="https://example.com/image.png"
                            autoCapitalize="none"
                        />
                        {/* Hiển thị ảnh preview */}
                        {thumbnail ? (
                            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
                        ) : null}

                        <Text style={styles.label}>Mô tả</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Nhập mô tả chi tiết..."
                            multiline
                            numberOfLines={4}
                        />

                        {/* Nút Cập nhật */}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Lưu thay đổi</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AdminUpdatePage;

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff", // Đổi nền trắng cho trang form
    },
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F8FA",
    },
    scroll: {
        paddingBottom: 50, // Thêm padding dưới
    },
    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
    },
    headerButton: {
        fontSize: 16,
        color: "#007AFF",
    },
    deleteText: {
        color: "#E53935",
    },
    // Form
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        backgroundColor: "#F7F8FA",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top", // Cho Android
    },
    thumbnail: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: "cover",
        backgroundColor: "#eee",
    },
    // Nút
    submitButton: {
        backgroundColor: "#8e3338ff", // Giống màu nút Create
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginBottom: 10,
    },
});