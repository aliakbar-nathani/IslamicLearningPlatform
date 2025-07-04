import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import CourseTabsSection from "@/components/CourseTabsSection";
import CourseSidebar from "@/components/CourseSidebar";
import { Clock, Users, Star, Globe, Loader2, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContextIntegrated";
import { useCourse, useCourseReviews, useCourseSections, useEnrollInCourse } from "@/hooks/useCourses";
import { useProgress } from "@/hooks/useProgress";
import { useCourseAccess } from "@/hooks/useAccess";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CourseDetailIntegrated = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // API calls
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError
  } = useCourse(id!);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError
  } = useCourseReviews(id!);

  const {
    data: sectionsData,
    isLoading: sectionsLoading,
    error: sectionsError
  } = useCourseSections(id!);

  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError
  } = useProgress(user?.id || '', id!);

  const {
    data: accessData,
    isLoading: accessLoading,
    error: accessError
  } = useCourseAccess(id!);

  const {
    mutate: enrollInCourse,
    isPending: enrollLoading
  } = useEnrollInCourse();

  // Error handling
  useEffect(() => {
    if (courseError) {
      toast({
        title: "Error loading course",
        description: courseError.message || "Failed to fetch course details.",
        variant: "destructive"
      });
    }
  }, [courseError, toast]);

  const course = courseData?.course;
  const reviews = reviewsData?.reviews || [];
  const sections = sectionsData?.sections || [];
  const progress = progressData?.progress;
  const access = accessData;

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll in this course.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!id) return;

    enrollInCourse(id, {
      onSuccess: () => {
        toast({
          title: "Enrolled Successfully",
          description: "You have been enrolled in this course!",
          variant: "default"
        });
      },
      onError: (error) => {
        toast({
          title: "Enrollment Failed",
          description: error.message || "Failed to enroll in course.",
          variant: "destructive"
        });
      }
    });
  };

  const isEnrolled = user?.enrolled_courses?.includes(id!) || false;
  const canAccess = access?.has_access || false;
  const canPreview = access?.can_preview || false;

  if (courseLoading || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                {course.is_free && <Badge className="bg-green-100 text-green-800">FREE</Badge>}
                {course.published && <Badge className="bg-blue-100 text-blue-800">Published</Badge>}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.total_duration ? `${Math.floor(course.total_duration / 60)}h ${course.total_duration % 60}m` : 'Self-paced'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.enrolled_students} students
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating.toFixed(1)} ({reviews.length} reviews)
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {course.language}
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Prerequisites:</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index}>{prerequisite}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <VideoPlayer 
                src={course.preview_video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                title={course.title}
                isPreview={!canAccess}
                canPlay={canAccess || canPreview}
              />
            </div>

            {/* Course Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <CourseTabsSection
                course={course}
                sections={sections}
                reviews={reviews}
                progress={progress}
                access={access}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar
              course={course}
              isEnrolled={isEnrolled}
              canAccess={canAccess}
              canPreview={canPreview}
              progress={progress}
              access={access}
              onEnroll={handleEnroll}
              enrollLoading={enrollLoading}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetailIntegrated;