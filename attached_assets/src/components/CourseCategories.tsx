
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Scroll, Scale, Clock, Globe, MessageCircle } from "lucide-react";

const categories = [
  {
    icon: BookOpen,
    title: "Quran Studies",
    description: "Tafsir, Tilawat, and Quranic Sciences",
    courses: 12,
    color: "bg-emerald-500"
  },
  {
    icon: Scroll,
    title: "Hadith & Sunnah",
    description: "Authentic narrations and their interpretations",
    courses: 8,
    color: "bg-blue-500"
  },
  {
    icon: Scale,
    title: "Fiqh & Jurisprudence",
    description: "Islamic law and practical rulings",
    courses: 15,
    color: "bg-amber-500"
  },
  {
    icon: Clock,
    title: "Islamic History",
    description: "From Prophet Muhammad to Imams",
    courses: 10,
    color: "bg-purple-500"
  },
  {
    icon: Globe,
    title: "Arabic Language",
    description: "Classical Arabic for Islamic texts",
    courses: 6,
    color: "bg-rose-500"
  },
  {
    icon: MessageCircle,
    title: "Theology & Philosophy",
    description: "Kalam and Islamic philosophy",
    courses: 7,
    color: "bg-teal-500"
  }
];

const CourseCategories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Course Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive Islamic education covering all aspects of Shia scholarship and practice
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-emerald-500">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-semibold">
                        {category.courses} Courses
                      </span>
                      <span className="text-gray-400 group-hover:text-emerald-500 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategories;
