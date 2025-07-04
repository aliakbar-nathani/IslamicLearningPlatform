
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, Play } from "lucide-react";

const courses = [
  {
    title: "Complete Tafsir of Surah Al-Baqarah",
    instructor: "Sheikh Ali Al-Husseini",
    duration: "24 hours",
    students: 1520,
    rating: 4.9,
    price: "$89",
    image: "photo-1466442929976-97f336a657be",
    level: "Intermediate"
  },
  {
    title: "Principles of Shia Fiqh",
    instructor: "Dr. Fatima Zahra",
    duration: "18 hours",
    students: 980,
    rating: 4.8,
    price: "$79",
    image: "photo-1492321936769-b49830bc1d1e", 
    level: "Advanced"
  },
  {
    title: "Life of Imam Ali (AS)",
    instructor: "Prof. Hassan Najafi",
    duration: "15 hours",
    students: 2100,
    rating: 4.9,
    price: "$65",
    image: "photo-1466442929976-97f336a657be",
    level: "Beginner"
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hand-picked courses from our most experienced scholars and instructors
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=400&h=200`}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <span className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
