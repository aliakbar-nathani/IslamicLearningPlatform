
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Users, Star, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allCourses = [
  {
    id: 1,
    title: "Complete Tafsir of Surah Al-Baqarah",
    instructor: "Sheikh Ali Al-Husseini",
    duration: "24 hours",
    students: 1520,
    rating: 4.9,
    price: "$89",
    image: "photo-1466442929976-97f336a657be",
    level: "Intermediate",
    category: "Quran Studies"
  },
  {
    id: 2,
    title: "Principles of Shia Fiqh",
    instructor: "Dr. Fatima Zahra",
    duration: "18 hours",
    students: 980,
    rating: 4.8,
    price: "$79",
    image: "photo-1492321936769-b49830bc1d1e",
    level: "Advanced",
    category: "Fiqh & Jurisprudence"
  },
  {
    id: 3,
    title: "Life of Imam Ali (AS)",
    instructor: "Prof. Hassan Najafi",
    duration: "15 hours",
    students: 2100,
    rating: 4.9,
    price: "$65",
    image: "photo-1466442929976-97f336a657be",
    level: "Beginner",
    category: "Islamic History"
  },
  {
    id: 4,
    title: "Hadith Studies: Sahih Al-Kafi",
    instructor: "Dr. Mohammad Reza",
    duration: "20 hours",
    students: 850,
    rating: 4.7,
    price: "$75",
    image: "photo-1492321936769-b49830bc1d1e",
    level: "Intermediate",
    category: "Hadith & Sunnah"
  },
  {
    id: 5,
    title: "Classical Arabic Grammar",
    instructor: "Prof. Amina Hassan",
    duration: "30 hours",
    students: 1200,
    rating: 4.8,
    price: "$95",
    image: "photo-1466442929976-97f336a657be",
    level: "Beginner",
    category: "Arabic Language"
  },
  {
    id: 6,
    title: "Philosophy of Ayatollah Tabatabai",
    instructor: "Dr. Ali Rezaei",
    duration: "16 hours",
    students: 650,
    rating: 4.6,
    price: "$70",
    image: "photo-1492321936769-b49830bc1d1e",
    level: "Advanced",
    category: "Theology & Philosophy"
  }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const categories = ["All", "Quran Studies", "Fiqh & Jurisprudence", "Islamic History", "Hadith & Sunnah", "Arabic Language", "Theology & Philosophy"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  onClick={() => setSelectedCategory(category)}
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
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=400&h=200`}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <span className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {course.category}
                </span>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 font-medium">
                    by {course.instructor}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-emerald-600">
                      {course.price}
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

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No courses found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
