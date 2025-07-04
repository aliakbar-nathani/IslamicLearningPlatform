import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  Star,
  Users,
  PlayCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextIntegrated";
import { useCourses } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useProgress";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const DashboardIntegrated = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // API calls
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError
  } = useUserProgress(user?.id || '');

  const {
    data: userCoursesData,
    isLoading: userCoursesLoading,
    error: userCoursesError
  } = useQuery({
    queryKey: ['user-courses', user?.id],
    queryFn: () => apiClient.getUserCourses(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: allCoursesData,
    isLoading: allCoursesLoading,
    error: allCoursesError
  } = useCourses({ per_page: 6 });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
            <Link to="/auth">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progress = progressData?.progress || [];
  const enrolledCourses = userCoursesData?.enrolled_courses || [];
  const createdCourses = userCoursesData?.created_courses || [];
  const wishlist = userCoursesData?.wishlist || [];
  const recommendedCourses = allCoursesData?.courses || [];

  const totalCourses = enrolledCourses.length;
  const completedCourses = progress.filter(p => p.progress_percentage >= 100).length;
  const averageProgress = progress.length > 0 
    ? progress.reduce((sum, p) => sum + p.progress_percentage, 0) / progress.length 
    : 0;

  const isLoading = progressLoading || userCoursesLoading || allCoursesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Loading your dashboard...</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.profile?.first_name || user?.username}!
          </h1>
          <p className="text-gray-600">
            Continue your Islamic learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {completedCourses} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
              <Progress value={averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Earned certificates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
              <Star className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wishlist.length}</div>
              <p className="text-xs text-muted-foreground">
                Saved courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-emerald-600" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress.length > 0 ? (
                  <div className="space-y-4">
                    {progress.slice(0, 3).map((p) => {
                      const course = enrolledCourses.find(c => c.id === p.course_id);
                      if (!course) return null;
                      
                      return (
                        <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <img 
                              src={course.thumbnail_url || `https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=100&h=100`}
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{course.title}</h3>
                              <p className="text-sm text-gray-600">{course.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={p.progress_percentage} className="w-32" />
                                <span className="text-sm text-gray-500">{p.progress_percentage.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <Link to={`/course/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                    <Link to="/courses">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.slice(0, 5).map((p) => {
                    const course = enrolledCourses.find(c => c.id === p.course_id);
                    if (!course) return null;
                    
                    return (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">{course.title}</p>
                            <p className="text-xs text-gray-500">
                              Last accessed: {new Date(p.last_accessed).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {p.progress_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course) => {
                      const courseProgress = progress.find(p => p.course_id === course.id);
                      const progressPercentage = courseProgress?.progress_percentage || 0;
                      
                      return (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img 
                              src={course.thumbnail_url || `https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=400&h=200`}
                              alt={course.title}
                              className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <Badge className="absolute top-2 left-2 bg-emerald-600">
                              {progressPercentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                            <Progress value={progressPercentage} className="mb-3" />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="h-4 w-4" />
                                {course.enrolled_students}
                              </div>
                              <Link to={`/course/${course.id}`}>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  {progressPercentage >= 100 ? 'Review' : 'Continue'}
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No enrolled courses yet</p>
                    <Link to="/courses">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {progress.length > 0 ? (
                  <div className="space-y-4">
                    {progress.map((p) => {
                      const course = enrolledCourses.find(c => c.id === p.course_id);
                      if (!course) return null;
                      
                      return (
                        <div key={p.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <Badge variant={p.progress_percentage >= 100 ? "default" : "secondary"}>
                              {p.progress_percentage >= 100 ? 'Completed' : 'In Progress'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <Progress value={p.progress_percentage} className="flex-1" />
                            <span className="text-sm font-medium">{p.progress_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Completed sections: {p.completed_subsections?.length || 0}</p>
                            <p>Last accessed: {new Date(p.last_accessed).toLocaleDateString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No progress data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedCourses.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={course.thumbnail_url || `https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=400&h=200`}
                            alt={course.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            {course.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {course.rating.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-emerald-600">
                                {course.is_free ? 'Free' : `$${course.price}`}
                              </span>
                              <Link to={`/course/${course.id}`}>
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recommendations available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardIntegrated;