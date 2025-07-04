import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Award, Users, MessageCircle, Bell } from "lucide-react";
import InstructorMessaging from "@/components/InstructorMessaging";
import StudyGroups from "@/components/StudyGroups";
import NotificationSystem from "@/components/NotificationSystem";

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-600">Please log in to access your dashboard.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const enrolledCourses = [
    {
      id: 1,
      title: "Complete Tafsir of Surah Al-Baqarah",
      progress: 65,
      instructor: "Sheikh Ali Al-Husseini",
      nextClass: "Tomorrow, 7:00 PM"
    }
  ];

  const achievements = [
    { title: "First Quiz Completed", date: "2024-01-10" },
    { title: "Study Streak: 7 days", date: "2024-01-15" },
    { title: "Course 50% Complete", date: "2024-01-12" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Continue your Islamic learning journey</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live-class">Live Class</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                  <p className="text-xs text-muted-foreground">Active learning paths</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Hours this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievements.length}</div>
                  <p className="text-xs text-muted-foreground">Earned this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Instructor
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Group
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="live-class">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Live Interactive Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Complete Tafsir of Surah Al-Baqarah</h3>
                      <p className="text-sm text-gray-600">Sheikh Ali Al-Husseini</p>
                      <p className="text-sm text-green-600">Live Now • 12 participants</p>
                    </div>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => window.open('/live-class/1', '_blank')}
                    >
                      Join Live Class
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <h3 className="font-semibold text-gray-600">Arabic Grammar Fundamentals</h3>
                      <p className="text-sm text-gray-500">Dr. Amina Hassan</p>
                      <p className="text-sm text-gray-500">Scheduled: Tomorrow, 3:00 PM</p>
                    </div>
                    <Button variant="outline" disabled>
                      Scheduled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <InstructorMessaging 
              courseId="1"
              instructorName="Sheikh Ali Al-Husseini"
              studentName={user.name}
            />
          </TabsContent>

          <TabsContent value="groups">
            <StudyGroups />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
                      <p className="text-sm text-gray-500 mb-4">Next class: {course.nextClass}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{course.progress}% complete</p>
                    </div>
                    <Button className="ml-4 bg-emerald-600 hover:bg-emerald-700">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
