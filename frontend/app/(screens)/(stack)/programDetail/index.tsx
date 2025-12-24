import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const ProgramDetailPage = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.titleText}>Chi tiết chương trình sức khỏe</Text>
      </View>

      <Image
        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjFkyP9-RVGlhYnrFKvLgPJOjZYe-eOta7hA&s" }}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Dinh dưỡng</Text>
        <View style={styles.tag}>
          <Ionicons name="book-outline" size={16} color="#3B82F6" />
          <Text style={styles.tagText}>200 bài giảng</Text>
        </View>

        <Text style={styles.description}>
          Dinh dưỡng là quá trình cung cấp và sử dụng các chất dinh dưỡng cần
          thiết cho cơ thể để duy trì sự sống, phát triển...
        </Text>

        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressText}>
              Hoàn thành: <Text style={styles.progressBold}>10%</Text>
            </Text>
          </View>
          <View>
            <Text style={styles.progressText}>
              Tuần: <Text style={styles.progressBold}>2/12</Text>
            </Text>
          </View>
        </View>

        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>Tuần học hiện tại</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekLessons}>
          {/* Tuần học item */}
          <TouchableOpacity style={styles.weekLessonItem}>
            <View style={styles.weekLessonThumbnail}>
              {/* Replace with real images */}
              <Text>Image 1</Text>
            </View>
            <View style={styles.weekLessonContent}>
              <Text style={styles.weekLessonTitle}>
                Bài 2 <Text style={styles.smallNote}>📖</Text>
              </Text>
              <Text style={styles.weekLessonDesc}>
                Tại sao bạn đang đáp chăn và cảm...
              </Text>
              <View style={styles.statusTagIncomplete}>
                <Text style={styles.statusTextIncomplete}>Chưa hoàn thành</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.weekLessonItem}>
            <View style={styles.weekLessonThumbnail}>
              <Text>Image 2</Text>
            </View>
            <View style={styles.weekLessonContent}>
              <Text style={styles.weekLessonTitle}>
                Bài 1 <Text style={styles.smallNote}>📖</Text>
              </Text>
              <Text style={styles.weekLessonDesc}>
                Tại sao bạn đang đáp chăn và cảm...
              </Text>
              <View style={styles.statusTagComplete}>
                <Text style={styles.statusTextComplete}>Đã hoàn thành</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Add more week lessons similarly */}
        </View>

        <View style={styles.weekListHeader}>
          <TouchableOpacity style={[styles.weekListButton, styles.activeBtn]}>
            <Text style={styles.weekListButtonTextActive}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.weekListButton]}>
            <Text style={styles.weekListButtonText}>Đã hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.weekListButton]}>
            <Text style={styles.weekListButtonText}>Chưa hoàn thành</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.totalWeeksText}>12 tuần học Thứ tự tăng dần ↑</Text>

        {/* Week items list */}
        <View style={styles.weekList}>
          <TouchableOpacity style={styles.weekItem}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 1</Text>
            <View style={styles.statusTagCompleteSmall}>
              <Text style={styles.statusTextCompleteSmall}>Đã hoàn thành</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.weekItem}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 2</Text>
            <View style={styles.statusTagIncompleteSmall}>
              <Text style={styles.statusTextIncompleteSmall}>Chưa hoàn thành</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.weekItemLocked}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 3</Text>
            <Ionicons name="lock-closed" size={20} color="#888" />
          </TouchableOpacity>

          {/* More locked weeks */}
          <TouchableOpacity style={styles.weekItemLocked}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 4</Text>
            <Ionicons name="lock-closed" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.weekItemLocked}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 5</Text>
            <Ionicons name="lock-closed" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.weekItemLocked}>
            {/* <Image
              source={require('/mnt/data/1cf45ec7-54d2-4a5e-9c01-d112ef48f1a6.png')}
              style={styles.weekItemAvatar}
            /> */}
            <Text style={styles.weekItemTitle}>Tuần học 6</Text>
            <Ionicons name="lock-closed" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProgramDetailPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleText: {
    paddingTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  banner: {
    width: '100%',
    height: 180,
  },
  content: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D0E6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    width: 120,
    gap: 4,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressBold: {
    fontWeight: '600',
    color: '#000',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  weekTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  seeAll: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 14,
  },
  weekLessons: {
    marginBottom: 20,
  },
  weekLessonItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  weekLessonThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekLessonContent: {
    flex: 1,
  },
  weekLessonTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  smallNote: {
    fontSize: 13,
  },
  weekLessonDesc: {
    fontSize: 13,
    color: '#666',
    marginVertical: 6,
  },
  statusTagComplete: {
    backgroundColor: '#D1FADF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTextComplete: {
    color: '#12B76A',
    fontWeight: '600',
    fontSize: 12,
  },
  statusTagIncomplete: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTextIncomplete: {
    color: '#F04438',
    fontWeight: '600',
    fontSize: 12,
  },

  weekListHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  weekListButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  weekListButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  weekListButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  totalWeeksText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  weekList: {
    gap: 12,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weekItemLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    opacity: 0.5,
  },
  weekItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  weekItemTitle: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
  },
  statusTagCompleteSmall: {
    backgroundColor: '#D1FADF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusTextCompleteSmall: {
    color: '#12B76A',
    fontWeight: '600',
    fontSize: 12,
  },
  statusTagIncompleteSmall: {
    backgroundColor: '#FFE4E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusTextIncompleteSmall: {
    color: '#F04438',
    fontWeight: '600',
    fontSize: 12,
  },
})
