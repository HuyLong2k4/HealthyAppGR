import { useLesson } from "@/context/LessonContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const LessonListPage = () => {
    const { lessons, isLoading, loadLessonsByCourse } = useLesson();

    const { courseId } = useLocalSearchParams();

    useEffect(() => {
        if (courseId) {
            loadLessonsByCourse(courseId);
        }
    }, [courseId, loadLessonsByCourse]);

    const handleDetail = (lessonId: any) => {
        router.push({
            pathname: "/(screens)/(stack)/courses/detailList",
            params: { lessonId: lessonId },
        });
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Danh sách bài học</Text>
                
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                > 
                    <Text style={styles.backButtonText}>Quay lại danh sách khóa học</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : lessons.length === 0 ? (
                    <Text style={styles.emptyText}>Chưa có bài học nào.</Text>
                ) : (
                    // Render danh sách bài học
                    lessons.map((lesson) => (
                        <View key={lesson._id} style={styles.lessonItem}>
                            {lesson.thumbnailURL ? (
                                <Image 
                                    source={{ uri: lesson.thumbnailURL }} 
                                    style={styles.thumbnail} 
                                />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Text style={styles.placeholderText}>Không có ảnh</Text>
                                </View>
                            )}
                            <Text style={styles.lessonName}>
                                {lesson.nameLesson || "Không có tên"}
                            </Text>

                            {lesson.target ? (
                                <Text style={styles.lessonDesc}>
                                    {lesson.target.length > 80
                                        ? lesson.target.slice(0, 80) + "..."
                                        : lesson.target}
                                </Text>
                            ) : null}

                            <View style={styles.buttonsRow}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.updateBtn]}
                                    onPress={() => handleDetail(lesson._id)}>
                                    <Text>
                                        Xem chi tiết
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default LessonListPage;

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