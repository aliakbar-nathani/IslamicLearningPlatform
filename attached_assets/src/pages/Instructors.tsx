
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Instructors from "@/components/Instructors";

const InstructorsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Header />
      <Instructors />
      <Footer />
    </div>
  );
};

export default InstructorsPage;
