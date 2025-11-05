import { useCourse } from "@/context/CourseContext";
import { useEnrollment } from "@/context/EnrollmentContext";
import { router } from "expo-router";
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

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

interface Enrollment {
  course: string | { _id: string };
}

const CategoryPage = () => {
  const { isLoading: isCoursesLoading, courses, refreshCourses } = useCourse();
  const { enrollInCourse, enrollment } = useEnrollment();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'enrolled', label: 'Đã tham gia' },
    { id: 'completed', label: 'Đã hoàn thành' }
  ];

  // Lọc danh sách khóa học dựa trên tab đang active
  const filteredCourses = courses.filter((course: Course) => {
    const isEnrolled = enrollment.some(
      (enr: Enrollment) => enr.course === course._id || 
        (typeof enr.course === 'object' && enr.course._id === course._id)
    );

    switch (activeTab) {
      case 'enrolled':
        return isEnrolled;
      case 'completed':
        // Tạm thời return false vì chưa có logic completed
        return false;
      case 'all':
      default:
        return true;
    }
  });

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
    } catch (err) {
      console.error("Lỗi khi đăng ký (từ component):", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleListLessons = (courseId: string) => {
    router.push({
      pathname: "/(screens)/(stack)/courses/list",
      params: { courseId: courseId },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Chương trình sức khỏe</Text>
      </View>

      <View style={styles.tabsOuterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {isCoursesLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : filteredCourses.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === 'enrolled' 
              ? "Bạn chưa tham gia khóa học nào."
              : activeTab === 'completed'
              ? "Bạn chưa hoàn thành khóa học nào."
              : "Chưa có khóa học nào."}
          </Text>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = enrollment.some(
              (enr) =>
                enr.course === course._id || enr.course?._id === course._id
            );
            const isEnrolling = enrollingId === course._id;

            return (
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
                  <View style={styles.enrolledContainer}>
                    <View>
                      <Text>Hoàn thành: </Text>
                    </View>
                    <View>
                      <TouchableOpacity 
                        onPress={() => handleListLessons(course._id)}
                        style={styles.continueButton}>
                        <Text 
                          style={styles.continueButtonText}
                          >Học tiếp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
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
    paddingTop: 60,
    backgroundColor: "#F5F7FA",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  pageTitleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A2138",
    letterSpacing: -0.5,
  },
  tabsOuterContainer: {
    backgroundColor: "#F5F7FA",
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: "#2563EB",
    borderColor: '#2563EB',
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  courseItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
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

  enrolledContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

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
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});
