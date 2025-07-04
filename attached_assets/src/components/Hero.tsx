
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Master Islamic Studies
                <span className="block text-amber-300">Online</span>
              </h1>
              <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed">
                Deepen your understanding of Shia Islamic teachings with expert instructors and comprehensive courses
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 text-lg">
                Start Learning Today
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-3 text-lg">
                View Courses
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-2">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-emerald-200">Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-emerald-200">Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-2">
                  <Star className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-emerald-200">Rating</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-2">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-emerald-200">Access</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-amber-400 rounded-full mx-auto flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-emerald-800" />
                </div>
                <h3 className="text-2xl font-bold">Join Our Community</h3>
                <p className="text-emerald-100">
                  Connect with scholars and students worldwide in your journey of Islamic learning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
