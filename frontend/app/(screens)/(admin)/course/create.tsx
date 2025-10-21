import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useCourse } from "@/context/CourseContext";
import { router } from "expo-router";

const AdminCoursePage = () => {
    const { user, logout } = useAuth();
    const { createCourse, isLoading } = useCourse();
    
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [description, setDescription] = useState('');

    console.log("AdminCoursePage rendered. User is:", user); 

    const handleCreate = async () => {
        if (!thumbnail.trim() || !description.trim() || !title.trim()) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const courseData = {
            title,
            thumbnail,
            description
        };

        const success = await createCourse(courseData);

        if (success) {
            setTitle('');
            setThumbnail('');
            setDescription('');
        }
    };

    const handleLogout = async () => {
        await logout();
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableOpacity style={styles.closeButton} onPress={handleLogout}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.updateButton} onPress={() => router.push('/(screens)/(admin)/course/update')}>
                    <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.header}>Tạo khóa học mới</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>URL ảnh bìa (Thumbnail)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://example.com/image.png"
                            value={thumbnail}
                            onChangeText={setThumbnail}
                            editable={!isLoading}
                            autoCapitalize="none"
                        />
                        <Text style={styles.label}>Mô tả khóa học</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tiêu đề cho khóa học"
                            value={title}
                            onChangeText={setTitle}
                            editable={!isLoading}
                            autoCapitalize="none"
                        />
                        <TextInput
                          style={[styles.input, styles.textArea]}
                          placeholder="Nhập mô tả chi tiết cho khóa học..."
                          value={description}
                          onChangeText={setDescription}
                          multiline
                          numberOfLines={5}
                          editable={!isLoading}
                        />
                    </View>

                    {isLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

                    <View style={styles.buttonContainer}>
                        <Button
                            title={isLoading ? "Đang xử lý..." : "Tạo khóa học"}
                            onPress={handleCreate}
                            disabled={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AdminCoursePage;


const styles = StyleSheet.create({
 safeArea: {
  flex: 1,
  backgroundColor: '#F7F8FA',
 },
 container: {
  flex: 1,
 },

 closeButton: {
    position: 'absolute',
    top: 65,
    left: 20,
    zIndex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
 },

 closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
 },
  updateButton: {
    position: 'absolute',
    top: 65,
    right: 20,
    zIndex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
 },

 updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
 },

 scrollView: {
  flexGrow: 1,
  padding: 20,
  paddingTop: 60
 },
 header: {
  fontSize: 26,
  fontWeight: 'bold',
  marginBottom: 24,
  textAlign: 'center',
  color: '#333',
 },
 form: {
  marginBottom: 20,
 },
 label: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  color: '#495057',
 },
 input: {
  borderWidth: 1,
  borderColor: '#CED4DA',
  borderRadius: 8,
  paddingHorizontal: 15,
  paddingVertical: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: '#FFFFFF',
 },
 textArea: {
  height: 120,
  textAlignVertical: 'top',
 },
 loader: {
  marginVertical: 20,
 },
 buttonContainer: {
  marginTop: 10,
 },
});