
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
  course: {
    price: string;
    duration: string;
    students: number;
    level: string;
  };
}

const CourseSidebar = ({ course }: CourseSidebarProps) => {
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{course.price}</div>
          <div className="text-sm text-gray-600">One-time purchase</div>
        </div>
        
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-4" size="lg">
          Enroll Now
        </Button>
        
        <Button variant="outline" className="w-full mb-6">
          Add to Wishlist
        </Button>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Students:</span>
            <span className="font-semibold">{course.students}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Level:</span>
            <span className="font-semibold">{course.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Language:</span>
            <span className="font-semibold">English/Arabic</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Certificate:</span>
            <span className="font-semibold">Yes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSidebar;
