import { useCourse } from "@/context/CourseContext";
import { useEnrollment } from "@/context/EnrollmentContext";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { FontAwesome } from '@expo/vector-icons';

const CategoryPage = () => {
  const { isLoading: isCoursesLoading, courses, refreshCourses } = useCourse();
  const { enrollInCourse, enrollment } = useEnrollment();
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    refreshCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
    } catch (err) {
      console.error("Lỗi khi đăng ký (từ component):", err);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    // Cải tiến: Container có nền xám nhạt
    <View style={styles.container}>
      {/* Cải tiến: Style tiêu đề trang riêng */}
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Chương trình sức khỏe</Text>
      </View>

      {/* Cải tiến: Style Tabs đẹp hơn */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Đã tham gia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Đã hoàn thành</Text>
        </TouchableOpacity>
      </View>

      {/* Cải tiến: Thêm paddingBottom cho ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {isCoursesLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : courses.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có khóa học nào.</Text>
        ) : (
          courses.map((course) => {
            const isEnrolled = enrollment.some(
              (enr) =>
                enr.course === course._id || enr.course?._id === course._id
            );
            const isEnrolling = enrollingId === course._id;

            return (
              // Cải tiến: Thẻ (card) với shadow và bo góc đẹp hơn
              <View key={course._id} style={styles.courseItem}>
                {course.thumbnail ? (
                  <Image
                    source={{ uri: course.thumbnail }}
                    style={styles.thumbnail}
                  />
                ) : null}

                {isEnrolled && (
                      <View style={styles.enrolledTag}>
                        <Text style={styles.enrolledTagText}>Đã tham gia</Text>
                      </View>
                  )}

                <Text style={styles.courseTitleText}>{course.title}</Text>

                <Text style={styles.descriptionText}>
                  {course.description}
                </Text>

                {isEnrolled ? (
                  // Nếu ĐÃ ĐĂNG KÝ: Hiển thị tag + nút "Học tiếp"
                  <View style={styles.enrolledContainer}>
                    <View>
                      <Text>Hoàn thành: </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Học tiếp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  // Nếu CHƯA ĐĂNG KÝ: Hiển thị nút "Đăng ký"
                  <TouchableOpacity
                    style={[
                      styles.cardButton,
                      isEnrolling && styles.disabledButton,
                    ]}
                    disabled={isEnrolling}
                    onPress={() => handleEnroll(course._id)}
                  >
                    <Text style={styles.cardButtonText}>
                      {isEnrolling ? "Đang đăng ký..." : "Đăng ký"}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* --- KẾT THÚC SỬA CẤU TRÚC --- */}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default CategoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // An toàn cho tai thỏ
    backgroundColor: "#F9F9F9", // Nền xám nhạt
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 40, // Khoảng trống dưới cùng
  },
  pageTitleContainer: {
    paddingHorizontal: 16, // Đồng bộ với padding của scrollview
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activeTab: {
    backgroundColor: "#E3EEFD",
    borderColor: '#E3EEFD',
  },
  tabText: {
    fontSize: 14, // To hơn cho dễ đọc
    fontWeight: '500',
    color: "#555",
  },
  activeTabText: {
    color: "#2F80ED",
    fontWeight: "bold",
  },
  courseItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16, // Bo góc mượt hơn
    marginBottom: 20, // Khoảng cách giữa các thẻ
    // Shadow đẹp hơn
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#EEE",
  },
  courseTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    marginHorizontal: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  // --- Container cho (Tag + Nút Học tiếp) ---
  enrolledContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  // Style cho Tag "Đã tham gia"
  enrolledTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  enrolledTagText: {
    color: '#2F80ED',
    fontWeight: '600',
    fontSize: 13,
  },
  // Style cho nút "Học tiếp" (Outline)
  continueButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2F80ED',
    marginTop: 16,
    backgroundColor: '#2F80ED'
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  // --- Nút "Đăng ký" ---
  cardButton: {
    backgroundColor: "#2F80ED",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // --- Trạng thái rỗng/lỗi ---
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});
