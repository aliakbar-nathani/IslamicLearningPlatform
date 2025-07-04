
import { useParams } from "react-router-dom";
import LiveClassroom from "@/components/LiveClassroom";
import { useAuth } from "@/contexts/AuthContext";

const LiveClassPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to join the live class.</p>
        </div>
      </div>
    );
  }

  // Mock data - in a real app, this would come from an API
  const classData = {
    classId: id || "1",
    className: "Complete Tafsir of Surah Al-Baqarah - Live Session",
    instructor: "Sheikh Ali Al-Husseini",
    isInstructor: user.name === "Sheikh Ali Al-Husseini",
    studentName: user.name
  };

  return (
    <LiveClassroom {...classData} />
  );
};

export default LiveClassPage;
