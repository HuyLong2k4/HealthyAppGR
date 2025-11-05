import { useLesson } from "@/context/LessonContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const AdminLessonListPage = () => {
    const { lessons, isLoading, loadLessonsByCourse, deleteLesson } = useLesson();

    const { id: courseId } = useLocalSearchParams();

    useFocusEffect(
        useCallback(() => {
            const loadLessons = async () => {
                if (courseId) {
                    console.log("Đang tải bài học cho khóa:", courseId);
                    await loadLessonsByCourse(courseId);
                }
            };
            
            loadLessons();
        }, [courseId, loadLessonsByCourse])
    );

    // Xử lý Xóa
    const handleDelete = (lessonId) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa bài học này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        await deleteLesson(lessonId); 
                    },
                },
            ]
        );
    };

    // Xử lý Sửa (Chuyển trang)
    const handleUpdate = (lessonId) => {
        router.push({
            pathname: "/(screens)/(admin)/lesson/update",
            params: { lessonId: lessonId, courseId: courseId },
        });
    };

    // Xử lý Tạo (Chuyển trang)
    const handleCreate = () => {
        router.push({
            pathname: "/(screens)/(admin)/lesson/create",
            params: { courseId: courseId },
        });
    };

    const handleDetail = (lessonId) => {
        router.push({
            pathname: "/(screens)/(admin)/lesson/detailList",
            params: { lessonId: lessonId },
        });
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Danh sách bài học</Text>
                
                {/* Nút Quay Lại */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                > 
                    <Text style={styles.backButtonText}>Quay lại danh sách khóa học</Text>
                </TouchableOpacity>

                {/* Nút Tạo Mới */}
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={handleCreate}
                > 
                    <Text style={styles.createButtonText}>Tạo bài học mới</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : lessons.length === 0 ? (
                    <Text style={styles.emptyText}>Chưa có bài học nào.</Text>
                ) : (
                    lessons.map((lesson) => (
                        <View key={lesson._id} style={styles.lessonItem}>
                            
                            {lesson.thumbnailURL ? (
                                <Image 
                                    key={`img-${lesson._id}`}
                                    source={{ uri: lesson.thumbnailURL }} 
                                    style={styles.thumbnail} 
                                />
                            ) : (
                                <View key={`placeholder-${lesson._id}`} style={styles.placeholderImage}>
                                    <Text style={styles.placeholderText}>Không có ảnh</Text>
                                </View>
                            )}

                            <Text key={`name-${lesson._id}`} style={styles.lessonName}>
                                {lesson.nameLesson || "Không có tên"}
                            </Text>

                            {lesson.target ? (
                                <Text key={`desc-${lesson._id}`} style={styles.lessonDesc}>
                                    {lesson.target.length > 80
                                        ? lesson.target.slice(0, 80) + "..."
                                        : lesson.target}
                                </Text>
                            ) : null}

                            <View key={`buttons-${lesson._id}`} style={styles.buttonsRow}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.updateBtn]}
                                    onPress={() => handleDetail(lesson._id)}>
                                    <Text>
                                        Xem chi tiết
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.updateBtn]}
                                    onPress={() => handleUpdate(lesson._id)}
                                >
                                    <Text style={styles.buttonText}>Sửa</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteBtn]}
                                    onPress={() => handleDelete(lesson._id)}
                                >
                                    <Text style={styles.buttonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminLessonListPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F7F8FA",
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

    lessonItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lessonName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 6,
    },
    lessonDesc: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },
    thumbnail: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    placeholderImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholderText: {
        color: '#999'
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
        marginBottom: 20,
    },
    createButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },

    backButton: {
        backgroundColor: "#BDBDBD",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    backButtonText: {
        color: "#000",
        fontWeight: "600",
        textAlign: "center",
    },
});