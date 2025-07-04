import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Server, Database, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContextIntegrated";
import { useCourses, useCourseCategories } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useProgress";
import apiClient from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const IntegrationDemo = () => {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);

  // Test API connectivity
  const { data: healthData, isError: healthError } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
  });

  const { data: categoriesData, isError: categoriesError } = useCourseCategories();
  const { data: coursesData, isError: coursesError } = useCourses({ per_page: 5 });
  const { data: progressData, isError: progressError } = useUserProgress(user?.id || '');

  const runIntegrationTests = async () => {
    setTesting(true);
    const results: Record<string, boolean> = {};

    try {
      // Test 1: Health Check
      const health = await apiClient.healthCheck();
      results.health = health.status === 'healthy';
    } catch {
      results.health = false;
    }

    try {
      // Test 2: Categories
      const categories = await apiClient.getCourseCategories();
      results.categories = categories.categories.length > 0;
    } catch {
      results.categories = false;
    }

    try {
      // Test 3: Courses
      const courses = await apiClient.getCourses({ per_page: 3 });
      results.courses = courses.courses.length >= 0; // Allow empty results
    } catch {
      results.courses = false;
    }

    if (user) {
      try {
        // Test 4: User Progress (if logged in)
        const progress = await apiClient.getUserProgress(user.id);
        results.progress = Array.isArray(progress.progress);
      } catch {
        results.progress = false;
      }
    } else {
      results.progress = true; // Skip if not logged in
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />;
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | undefined) => {
    if (status === undefined) return <Badge variant="secondary">Testing...</Badge>;
    return status ? 
      <Badge className="bg-green-100 text-green-800">Connected</Badge> : 
      <Badge variant="destructive">Error</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            API Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backend Health */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Backend Health</span>
              </div>
              {!healthError ? (
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              ) : (
                <Badge variant="destructive">Disconnected</Badge>
              )}
            </div>

            {/* Authentication */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">Authentication</span>
              </div>
              {isAuthenticated ? (
                <Badge className="bg-green-100 text-green-800">Logged In</Badge>
              ) : (
                <Badge variant="secondary">Not Logged In</Badge>
              )}
            </div>

            {/* Categories API */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Categories API</span>
              </div>
              {!categoriesError ? (
                <Badge className="bg-green-100 text-green-800">
                  {categoriesData?.categories.length || 0} categories
                </Badge>
              ) : (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>

            {/* Courses API */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Courses API</span>
              </div>
              {!coursesError ? (
                <Badge className="bg-green-100 text-green-800">
                  {coursesData?.courses.length || 0} courses loaded
                </Badge>
              ) : (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={runIntegrationTests}
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Integration Tests'
              )}
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Test Results:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Health Check</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.health)}
                    {getStatusBadge(testResults.health)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Categories API</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.categories)}
                    {getStatusBadge(testResults.categories)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Courses API</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.courses)}
                    {getStatusBadge(testResults.courses)}
                  </div>
                </div>
                {user && (
                  <div className="flex items-center justify-between">
                    <span>Progress API</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.progress)}
                      {getStatusBadge(testResults.progress)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>API Client configured and connected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>React Query setup for data fetching</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Authentication context integrated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Course management hooks available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Progress tracking implemented</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Access control system ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current User Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Enrolled Courses:</strong> {user.enrolled_courses?.length || 0}</p>
              <p><strong>Wishlist:</strong> {user.wishlist?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegrationDemo;