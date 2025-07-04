
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Users, Star, Filter, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCourses, useCourseCategories } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // API calls
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses
  } = useCourses({
    search: searchTerm || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory,
    level: selectedLevel === "All" ? undefined : selectedLevel,
    page: currentPage,
    per_page: 12
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useCourseCategories();

  // Error handling
  useEffect(() => {
    if (coursesError) {
      toast({
        title: "Error loading courses",
        description: coursesError.message || "Failed to fetch courses. Please try again.",
        variant: "destructive"
      });
    }
  }, [coursesError, toast]);

  useEffect(() => {
    if (categoriesError) {
      toast({
        title: "Error loading categories",
        description: categoriesError.message || "Failed to fetch categories.",
        variant: "destructive"
      });
    }
  }, [categoriesError, toast]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedLevel]);

  const courses = coursesData?.courses || [];
  const pagination = coursesData?.pagination;
  const categories = ["All", ...(categoriesData?.categories || [])];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setCurrentPage(1);
  };

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-gray-600">Loading courses...</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-xl text-gray-600">Discover comprehensive Islamic education from renowned scholars</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses or instructors..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Category: {selectedCategory}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Level Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Level: {selectedLevel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {levels.map(level => (
                <DropdownMenuItem 
                  key={level}
                  onClick={() => handleLevelChange(level)}
                >
                  {level}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={() => refetchCourses()}
            className="w-full md:w-auto"
          >
            Refresh
          </Button>
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {pagination.total} course{pagination.total !== 1 ? 's' : ''}
              {pagination.pages > 1 && ` • Page ${pagination.page} of ${pagination.pages}`}
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course) => (
              <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={course.thumbnail_url || `https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=400&h=200`}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <span className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {course.category}
                  </span>
                  {course.is_free && (
                    <span className="absolute bottom-4 left-4 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                      FREE
                    </span>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.total_duration ? `${Math.floor(course.total_duration / 60)}h ${course.total_duration % 60}m` : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.enrolled_students}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold text-emerald-600">
                        {course.is_free ? 'Free' : `$${course.price}`}
                      </span>
                      <Link to={`/course/${course.id}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
            <Button 
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
            >
              Previous
            </Button>
            
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className={currentPage === pageNum ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
