import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, TrendingUp, Upload, BarChart3, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CourseManagement from "@/components/admin/CourseManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import BulkContentUpload from "@/components/admin/BulkContentUpload";
import CourseCreationWizard from "@/components/admin/CourseCreationWizard";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [showCourseCreation, setShowCourseCreation] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-600">Admin access required.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const adminStats = [
    {
      title: "Total Courses",
      value: "24",
      icon: BookOpen,
      change: "+12%"
    },
    {
      title: "Active Students",
      value: "1,234",
      icon: Users,
      change: "+8%"
    },
    {
      title: "Revenue",
      value: "$45,678",
      icon: TrendingUp,
      change: "+15%"
    },
    {
      title: "Completion Rate",
      value: "78%",
      icon: BarChart3,
      change: "+5%"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage courses, analytics, and content</p>
            </div>
            <Button 
              onClick={() => setShowCourseCreation(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>

        {showCourseCreation ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowCourseCreation(false)}
              >
                Back to Dashboard
              </Button>
            </div>
            <CourseCreationWizard />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Course Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-600">{stat.change} from last month</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">New course "Advanced Tajweed" created</p>
                          <p className="text-sm text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">50 new student registrations</p>
                          <p className="text-sm text-gray-600">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Upload className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Bulk content upload completed</p>
                          <p className="text-sm text-gray-600">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">Add Course</span>
                        </div>
                      </Card>
                      <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Upload Content</span>
                        </div>
                      </Card>
                      <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">View Reports</span>
                        </div>
                      </Card>
                      <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-orange-600" />
                          <span className="font-medium">Manage Users</span>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="upload">
              <BulkContentUpload />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
