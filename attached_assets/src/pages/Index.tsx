
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CourseCategories from "@/components/CourseCategories";
import FeaturedCourses from "@/components/FeaturedCourses";
import Instructors from "@/components/Instructors";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Header />
      <Hero />
      <CourseCategories />
      <FeaturedCourses />
      <Instructors />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
