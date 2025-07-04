import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseSectionManager from "./CourseSectionManager";
import CourseReviewPublish from "./CourseReviewPublish";

export interface CourseMaterial {
  id: string;
  title: string;
  name: string;
  file: File | null;
  type: 'pdf' | 'image' | 'video' | 'document';
  url: string;
  size: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  questions: QuizQuestion[];
  passingScore?: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  videoFile: File | null;
  videoUrl?: string;
  duration: string;
  materials: CourseMaterial[];
  quiz?: Quiz;
  instructorNotes: string;
  order: number;
}

export interface CourseData {
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  isPaid: boolean;
  previewEnabled: boolean;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  tags: string[];
  sections: CourseSection[];
}

const CourseCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "Beginner",
    price: 0,
    isPaid: false,
    previewEnabled: true,
    tags: [],
    sections: []
  });

  const steps = [
    { id: 0, title: "Basic Information", completed: false },
    { id: 1, title: "Course Sections", completed: false },
    { id: 2, title: "Review & Publish", completed: false }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    console.log("Publishing course:", courseData);
    // Here you would typically send the data to your backend
    alert("Course published successfully!");
  };

  const getStepProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CourseBasicInfo
            courseData={courseData}
            setCourseData={setCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={true}
            isLastStep={false}
          />
        );
      case 1:
        return (
          <CourseSectionManager
            courseData={courseData}
            setCourseData={setCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={false}
            isLastStep={false}
          />
        );
      case 2:
        return (
          <CourseReviewPublish
            courseData={courseData}
            setCourseData={setCourseData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onPublish={handlePublish}
            isFirstStep={false}
            isLastStep={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
          <div className="space-y-4">
            <Progress value={getStepProgress()} className="w-full" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    index <= currentStep ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        index <= currentStep
                          ? "border-emerald-600 bg-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {index === currentStep && (
                        <div className="w-full h-full rounded-full bg-white border-2 border-emerald-600"></div>
                      )}
                    </div>
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCreationWizard;
