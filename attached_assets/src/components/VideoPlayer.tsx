
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, FileText, Download, BookOpen } from "lucide-react";
import DownloadableResources from "./DownloadableResources";
import Quiz from "./Quiz";
import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  currentVideo: string | null;
  selectedModule: number | null;
  selectedSubsection: number | null;
  course: {
    image: string;
    title: string;
    previewVideo: string;
    curriculum: Array<{ 
      title: string;
      duration: string;
      summary: string;
      resources: Array<{
        id: string;
        title: string;
        type: 'pdf' | 'image' | 'video' | 'document';
        size: string;
        downloadUrl: string;
      }>;
      quiz: {
        title: string;
        questions: Array<{
          id: string;
          question: string;
          options: string[];
          correctAnswer: number;
          explanation?: string;
        }>;
      };
      subsections: Array<{
        title: string;
        duration: string;
        videoUrl: string;
        isPreview: boolean;
        instructorNotes: string;
        summary: string;
      }>;
    }>;
  };
  onPreviewPlay: () => void;
  onMarkComplete?: (sectionIndex: number, subsectionIndex: number) => void;
  courseProgress?: {[key: string]: boolean};
}

const VideoPlayer = ({ 
  currentVideo, 
  selectedModule, 
  selectedSubsection,
  course, 
  onPreviewPlay,
  onMarkComplete,
  courseProgress = {}
}: VideoPlayerProps) => {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const currentSection = selectedModule !== null ? course.curriculum[selectedModule] : null;
  const currentSubsection = currentSection && selectedSubsection !== null ? currentSection.subsections[selectedSubsection] : null;

  // Auto-scroll to video section when a new module is selected
  useEffect(() => {
    if (selectedModule !== null && videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [selectedModule, selectedSubsection, currentVideo]);

  const handleSectionQuizComplete = (score: number) => {
    if (score >= 70 && selectedModule !== null && selectedSubsection !== null && onMarkComplete) {
      onMarkComplete(selectedModule, selectedSubsection);
    }
  };

  const isSubsectionComplete = () => {
    if (selectedModule !== null && selectedSubsection !== null) {
      return courseProgress[`${selectedModule}-${selectedSubsection}`] || false;
    }
    return false;
  };

  return (
    <div className="space-y-6" ref={videoSectionRef}>
      {/* Video Player */}
      <Card>
        <div className="relative">
          {currentVideo ? (
            <div className="relative">
              <video 
                controls 
                className="w-full h-64 rounded-t-lg"
                src={currentVideo}
              >
                Your browser does not support the video tag.
              </video>
              {currentSection && currentSubsection && (
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                  Section {selectedModule! + 1}: {currentSection.title} - Lesson {selectedSubsection! + 1}
                </div>
              )}
            </div>
          ) : (
            <>
              <img 
                src={`https://images.unsplash.com/${course.image}?auto=format&fit=crop&w=800&h=400`}
                alt={course.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={onPreviewPlay}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Preview Course
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Current Subsection Details */}
      {currentSection && currentSubsection && selectedModule !== null && selectedSubsection !== null && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subsection Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Lesson {selectedSubsection + 1}: {currentSubsection.title}
                </CardTitle>
                {isSubsectionComplete() && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {currentSubsection.duration}
              </div>
              <p className="text-sm text-gray-600">
                From Section: {currentSection.title}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lesson Summary
                </h4>
                <p className="text-gray-700 text-sm">{currentSubsection.summary}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Instructor Notes
                </h4>
                <p className="text-gray-700 text-sm italic">{currentSubsection.instructorNotes}</p>
              </div>

              {onMarkComplete && !isSubsectionComplete() && (
                <Button
                  onClick={() => onMarkComplete(selectedModule, selectedSubsection)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Mark as Complete
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Section Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Section Resources
              </CardTitle>
              <p className="text-sm text-gray-600">
                Resources for the entire section: {currentSection.title}
              </p>
            </CardHeader>
            <CardContent>
              {currentSection.resources.length > 0 ? (
                <div className="space-y-3">
                  {currentSection.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">{resource.title}</h5>
                          <p className="text-xs text-gray-600">{resource.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log(`Downloading ${resource.title}`)}
                        className="hover:bg-emerald-50"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No resources available for this section.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section Quiz */}
      {currentSection && selectedModule !== null && currentSection.quiz.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Section Quiz</CardTitle>
            <p className="text-sm text-gray-600">Complete this quiz after finishing all lessons in this section (70% required to pass)</p>
          </CardHeader>
          <CardContent>
            <Quiz
              title={currentSection.quiz.title}
              questions={currentSection.quiz.questions}
              onComplete={handleSectionQuizComplete}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoPlayer;
