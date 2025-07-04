
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Clock } from "lucide-react";

const AnalyticsDashboard = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Active Students",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: Users
    },
    {
      title: "Course Completions",
      value: "89%",
      change: "-2.1%",
      trend: "down",
      icon: BookOpen
    },
    {
      title: "Avg. Study Time",
      value: "4.2h",
      change: "+15.3%",
      trend: "up",
      icon: Clock
    }
  ];

  const topCourses = [
    {
      title: "Complete Tafsir of Surah Al-Baqarah",
      students: 245,
      revenue: "$48,755",
      completion: 87,
      rating: 4.8
    },
    {
      title: "Arabic Grammar Fundamentals",
      students: 180,
      revenue: "$26,820",
      completion: 92,
      rating: 4.9
    },
    {
      title: "Hadith Sciences Introduction",
      students: 95,
      revenue: "$17,005",
      completion: 78,
      rating: 4.7
    },
    {
      title: "Islamic History Essentials",
      students: 156,
      revenue: "$23,400",
      completion: 85,
      rating: 4.6
    }
  ];

  const studentEngagement = [
    { metric: "Daily Active Users", value: 342, change: "+5.2%" },
    { metric: "Weekly Active Users", value: 1089, change: "+12.8%" },
    { metric: "Monthly Active Users", value: 2156, change: "+18.3%" },
    { metric: "Session Duration", value: "24 min", change: "+7.1%" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-600">{course.students} students</span>
                      <span className="text-xs text-gray-600">{course.revenue}</span>
                      <Badge variant="outline" className="text-xs">
                        ★ {course.rating}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Progress value={course.completion} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600">{course.completion}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentEngagement.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.metric}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">{item.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Course Sales</span>
                <span className="font-medium">$38,942</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Certifications</span>
                <span className="font-medium">$4,536</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Premium Content</span>
                <span className="font-medium">$2,200</span>
              </div>
              <hr />
              <div className="flex justify-between items-center font-medium">
                <span>Total</span>
                <span>$45,678</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Tafsir", count: 8, percentage: 35 },
                { name: "Hadith", count: 6, percentage: 28 },
                { name: "Fiqh", count: 4, percentage: 18 },
                { name: "Language", count: 3, percentage: 12 },
                { name: "History", count: 2, percentage: 7 }
              ].map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span>{category.count} courses</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">78%</div>
                <p className="text-sm text-gray-600">Average Completion Rate</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Courses</span>
                  <span className="font-medium">892</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>In Progress</span>
                  <span className="font-medium">245</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Not Started</span>
                  <span className="font-medium">97</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
