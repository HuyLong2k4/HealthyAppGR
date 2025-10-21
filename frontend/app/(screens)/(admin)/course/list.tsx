import { useAuth } from "@/context/AuthContext";
import { useCourse } from "@/context/CourseContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const AdminListPage = () => {
    const { courses, isLoading, refreshCourses, deleteCourse } = useCourse();
    const { logout } = useAuth();

    // --- Tự động tải danh sách khi vào trang ---
    useEffect(() => {
        refreshCourses();
    }, []);

    const handleLogout = async () => {
        await logout();
        router.replace("/(screens)/(stack)/login")
    }

    // --- Hàm xử lý xóa khóa học ---
    const handleDelete = (id) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa khóa học này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteCourse(id);
                        if (success) refreshCourses();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    <Text style={styles.title}>Danh sách khóa học</Text>
                    
                    <TouchableOpacity style={styles.createButton}> 
                        <Text 
                            style={styles.createButtonText}
                            onPress={() => router.push("/(screens)/(admin)/course/create")}
                            >Tạo khóa học</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    > 
                        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : courses.length === 0 ? (
                        <Text style={styles.emptyText}>Chưa có khóa học nào.</Text>
                    ) : (
                        courses.map((course) => (
                            <View key={course._id} style={styles.courseItem}>
                                <Text style={styles.courseName}>
                                    {course.title || "Không có tên"}
                                </Text>

                                {course.thumbnail ? (
                                    <Image 
                                        source={{ uri: course.thumbnail }} 
                                        style={styles.thumbnail} 
                                    />
                                ) : null}

                                {course.description ? (
                                    <Text style={styles.courseDesc}>
                                        {course.description.length > 80
                                            ? course.description.slice(0, 80) + "..."
                                            : course.description}
                                    </Text>
                                ) : null}

                                {course.user && (
                                    <Text style={styles.authorText}>
                                        👤 {course.user.username || "Không rõ"}
                                    </Text>
                                )}

                                <View style={styles.buttonsRow}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.updateBtn]}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/(screens)/(admin)/course/update",
                                                params: { id: course._id },
                                            })
                                        }
                                    >
                                        <Text style={styles.buttonText}>Sửa</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.deleteBtn]}
                                        onPress={() => handleDelete(course._id)}
                                    >
                                        <Text style={styles.buttonText}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AdminListPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },
    container: {
        flex: 1,
    },
    scroll: {
        paddingTop: 40,
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 50,
    },
    courseItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    courseName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 6,
    },
    courseDesc: {
        fontSize: 14,
        color: "#555",
        marginBottom: 6,
    },
    authorText: {
        fontSize: 13,
        color: "#777",
        marginBottom: 10,
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    updateBtn: {
        backgroundColor: "#4CAF50",
    },
    deleteBtn: {
        backgroundColor: "#E53935",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    createButton: {
        backgroundColor: "#8e3338ff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    createButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
    thumbnail: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'cover',
    },

    logoutButton: {
        backgroundColor: "#BDBDBD",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },

    logoutButtonText: {
        color: "#000",
        fontWeight: "600",
        textAlign: "center",
    }
});
