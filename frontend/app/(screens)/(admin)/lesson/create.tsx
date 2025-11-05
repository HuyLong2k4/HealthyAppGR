import { useLesson } from "@/context/LessonContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AdminCreateLessonPage = () => {

    const { courseId } = useLocalSearchParams();
    
    const { createLesson, isLoading } = useLesson();

    const [nameLesson, setNameLesson] = useState("");
    const [linkVid, setLinkVid] = useState("");
    const [thumbnailURL, setThumbnailURL] = useState("");
    const [target, setTarget] = useState("");

    const handleSubmit = async () => {
        if (!nameLesson || !linkVid) {
            Alert.alert("Lỗi", "Tên bài học và Link video là bắt buộc.");
            return;
        }

        const lessonData = {
            nameLesson,
            linkVid,
            thumbnailURL,
            target,
            course: courseId,
        };

        const success = await createLesson(lessonData);

        if (success) {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Tạo bài học mới</Text>

                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                > 
                    <Text style={styles.backButtonText}>Hủy</Text>
                </TouchableOpacity>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên bài học (*)</Text>
                    <TextInput
                        style={styles.input}
                        value={nameLesson}
                        onChangeText={setNameLesson}
                        placeholder="VD: Bài 1: Giới thiệu về dinh dưỡng"
                    />

                    <Text style={styles.label}>Link Video (YouTube) (*)</Text>
                    <TextInput
                        style={styles.input}
                        value={linkVid}
                        onChangeText={setLinkVid}
                        placeholder="https://www.youtube.com/watch?v=..."
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Link Ảnh Thumbnail (Tùy chọn)</Text>
                    <TextInput
                        style={styles.input}
                        value={thumbnailURL}
                        onChangeText={setThumbnailURL}
                        placeholder="https://.../image.png"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Mục tiêu / Mô tả (Tùy chọn)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={target}
                        onChangeText={setTarget}
                        placeholder="Mô tả ngắn về nội dung bài học..."
                        multiline
                        numberOfLines={4}
                    />

                    {/* Nút Submit */}
                    <TouchableOpacity 
                        style={[styles.submitButton, isLoading && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    > 
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Tạo bài học</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminCreateLessonPage;

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

    backButton: {
        backgroundColor: "#BDBDBD",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    backButtonText: {
        color: "#000",
        fontWeight: "600",
        textAlign: "center",
    },

    formContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    input: {
        backgroundColor: '#F7F8FA',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    submitButton: {
        backgroundColor: "#8e3338ff",
        borderRadius: 8,
        padding: 14,
        marginTop: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    },
});