import { Ionicons } from '@expo/vector-icons';
// SỬA: Import useLocalSearchParams để lấy lessonId
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert // SỬA: Thêm Alert
    ,







    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import YoutubeIframe from 'react-native-youtube-iframe';
import { useLesson } from '../../../../context/LessonContext';

/**
 * Lấy ID video từ bất kỳ URL YouTube nào
 * @param {string} url - URL YouTube
 * @returns {string | null} - Trả về Video ID hoặc null
 */
function getYouTubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


// Dữ liệu giả lập cho danh sách file (Giữ nguyên)
const dummyAttachments = [
    { id: 1, name: 'File đính kèm 1.pdf' },
    { id: 2, name: 'File đính kèm 2.pdf' },
];

const LessonDetailPage = () => {
    const { lessonId } = useLocalSearchParams(); 

    const [playing, setPlaying] = useState(false);
    const { lessons, isLoading, refreshLessons } = useLesson();

    useEffect(() => {
        refreshLessons();
    }, []);

    const lesson = lessons.find(l => l._id === lessonId);
    
    const videoId = lesson ? getYouTubeVideoId(lesson.linkVid) : null;

    const handleCompletePress = () => {
        console.log(`Đánh dấu hoàn thành cho lesson: ${lessonId}`);
        Alert.alert("Đã hoàn thành", "Bạn đã hoàn thành bài học này.");
    };

    const renderAttachment = (item) => (
        <TouchableOpacity key={item.id} style={styles.attachmentRow}>
            <Ionicons name="document-text-sharp" size={28} color="#4A90E2" />
            <Text style={styles.attachmentText}>{item.name}</Text>
            <Ionicons name="download-outline" size={24} color="#888" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;
    }
    if (!lesson) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 50 }}>Không tìm thấy bài học.</Text>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.headerButton}>
                    <Text>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {lesson.nameLesson}
                    </Text>
                    <View style={{ width: 28 }} />
                </View>
                
                {videoId ? (
                    <View style={styles.videoContainer}>
                        <YoutubeIframe
                            height={220}
                            play={playing}
                            videoId={videoId}
                            onChangeState={(event) => {
                                if (event === 'ended') {
                                    setPlaying(false);
                                    handleCompletePress();
                                }
                            }}
                        />
                    </View>
                ) : (
                    // 2. Ảnh banner (Nếu không có video)
                    lesson.thumbnailURL && (
                        <Image
                            source={{ uri: lesson.thumbnailURL }}
                            style={styles.bannerImage}
                        />
                    )
                )}

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{lesson.nameLesson || "Không có tên"}</Text>
                    <Text style={styles.description}>{lesson.target || "Không có mô tả"}</Text>
                </View>

                <View style={styles.attachmentContainer}>
                    <Text style={styles.subtitle}>Tài liệu đính kèm</Text>
                    {dummyAttachments.map(renderAttachment)}
                </View>

            </ScrollView>

            <View style={styles.footerContainer}>
                <TouchableOpacity 
                    style={styles.completeButton}
                    onPress={handleCompletePress}
                >
                    <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                    <Text style={styles.completeButtonText}>Đánh dấu là đã hoàn thành</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LessonDetailPage;

const styles = StyleSheet.create({
    container: {
        marginTop:40,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    headerTitle : {
        fontSize: 17,
        fontWeight: "600",
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    headerButton: { // Style này giờ không dùng, nhưng giữ lại
        fontSize: 16,
        color: "#007AFF",
    },
    bannerImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },
    contentContainer: { // Style này bạn đã định nghĩa
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    subtitle: { // Style này bạn đã định nghĩa
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    videoContainer: {
        // Bỏ margin 16 để video full-width
        marginVertical: 8,
        height: 220, // Đặt chiều cao cứng
        backgroundColor: '#000',
    },
    attachmentContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    attachmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        marginBottom: 10,
    },
    attachmentText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24, // Thêm padding cho an toàn
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    completeButton: {
        backgroundColor: '#4A90E2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});