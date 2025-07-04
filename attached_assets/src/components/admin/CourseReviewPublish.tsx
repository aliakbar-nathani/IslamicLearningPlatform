
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Video, FileText, BookOpen as QuizIcon, DollarSign, Users, Clock } from "lucide-react";
import { CourseData } from "./CourseCreationWizard";

interface CourseReviewPublishProps {
  courseData: CourseData;
  setCourseData: (data: CourseData) => void;
  onNext: () => void;
  onPrevious: () => void;
  onPublish: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const CourseReviewPublish = ({ courseData, onPrevious, onPublish }: CourseReviewPublishProps) => {
  const totalMaterials = courseData.sections.reduce((total, section) => total + section.materials.length, 0);
  const totalQuizzes = courseData.sections.filter(section => section.quiz).length;
  const sectionsWithVideo = courseData.sections.filter(section => section.videoUrl).length;
  
  const completionChecks = [
    { 
      label: "Course basic information", 
      completed: !!(courseData.title && courseData.description && courseData.instructor),
      required: true
    },
    { 
      label: "Course thumbnail", 
      completed: !!courseData.thumbnailUrl,
      required: true
    },
    { 
      label: "Preview video", 
      completed: !!courseData.previewVideoUrl,
      required: false
    },
    { 
      label: "At least one section", 
      completed: courseData.sections.length > 0,
      required: true
    },
    { 
      label: "All sections have videos", 
      completed: sectionsWithVideo === courseData.sections.length,
      required: true
    },
    { 
      label: "Course materials", 
      completed: totalMaterials > 0,
      required: false
    },
    { 
      label: "Section quizzes", 
      completed: totalQuizzes > 0,
      required: false
    }
  ];

  const requiredCompleted = completionChecks.filter(check => check.required && check.completed).length;
  const requiredTotal = completionChecks.filter(check => check.required).length;
  const canPublish = requiredCompleted === requiredTotal;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{courseData.title}</h3>
              <p className="text-gray-600">{courseData.description}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Instructor:</span>
                <span className="text-sm">{courseData.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="secondary">{courseData.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Price:</span>
                <span className="text-sm flex items-center">
                  {courseData.isPaid ? (
                    <>
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${courseData.price}
                    </>
                  ) : (
                    'Free'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {courseData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <Video className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-600">{courseData.sections.length}</p>
                <p className="text-xs text-emerald-700">Sections</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">{totalMaterials}</p>
                <p className="text-xs text-blue-700">Materials</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <QuizIcon className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">{totalQuizzes}</p>
                <p className="text-xs text-purple-700">Quizzes</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-600">~2h</p>
                <p className="text-xs text-orange-700">Est. Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publication Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionChecks.map((check, index) => (
              <div key={index} className="flex items-center space-x-3">
                {check.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${check.required ? 'text-red-500' : 'text-gray-400'}`} />
                )}
                <span className={`${check.completed ? 'text-green-700' : check.required ? 'text-red-600' : 'text-gray-500'}`}>
                  {check.label}
                  {check.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Completion: {requiredCompleted}/{requiredTotal} required items
              </p>
              <p className="text-sm text-gray-600">
                {canPublish ? 'Your course is ready to publish!' : 'Complete required items to publish'}
              </p>
            </div>
            <div className="flex items-center">
              {canPublish ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Sections Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courseData.sections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">Section {index + 1}</Badge>
                  <span className="font-medium">{section.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {section.videoUrl && <Video className="w-4 h-4 text-green-600" />}
                  {section.materials.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {section.materials.length} materials
                    </Badge>
                  )}
                  {section.quiz && <QuizIcon className="w-4 h-4 text-purple-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Course Sections
        </Button>
        <div className="space-x-3">
          <Button variant="outline">
            Save as Draft
          </Button>
          <Button
            onClick={onPublish}
            disabled={!canPublish}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {canPublish ? 'Publish Course' : 'Complete Required Items'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewPublish;
