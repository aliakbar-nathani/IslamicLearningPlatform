
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Star, Play, FileText, Clock, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DownloadableResources from "./DownloadableResources";
import Quiz from "./Quiz";
import Certificate from "./Certificate";
import { useState } from "react";

interface CourseTabsSectionProps {
  course: {
    whatYouLearn: string[];
    requirements: string[];
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
    instructor: string;
    instructorBio: string;
  };
  onVideoPlay: (videoUrl: string, sectionIndex: number, subsectionIndex: number) => void;
  studentName?: string;
  courseProgress: {[key: string]: boolean};
  onMarkComplete: (sectionIndex: number, subsectionIndex: number) => void;
}

const CourseTabsSection = ({ 
  course, 
  onVideoPlay, 
  studentName = "Student",
  courseProgress,
  onMarkComplete
}: CourseTabsSectionProps) => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({});

  const toggleSectionExpansion = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true);
    setQuizScore(score);
    if (score >= 70) {
      setShowCertificate(true);
    }
  };

  const handleSectionQuizComplete = (sectionIndex: number, score: number) => {
    if (score >= 70) {
      // Mark all subsections of this section as complete
      course.curriculum[sectionIndex].subsections.forEach((_, subsectionIndex) => {
        onMarkComplete(sectionIndex, subsectionIndex);
      });
    }
  };

  const handleCertificateDownload = () => {
    console.log("Downloading certificate...");
    // In a real app, this would generate and download a PDF certificate
  };

  const isSubsectionComplete = (sectionIndex: number, subsectionIndex: number) => {
    return courseProgress[`${sectionIndex}-${subsectionIndex}`] || false;
  };

  const getSectionProgress = (sectionIndex: number) => {
    const section = course.curriculum[sectionIndex];
    const completedSubsections = section.subsections.filter((_, subsectionIndex) => 
      isSubsectionComplete(sectionIndex, subsectionIndex)
    ).length;
    return { completed: completedSubsections, total: section.subsections.length };
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="instructor">Instructor</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.whatYouLearn.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Requirements</h3>
            <ul className="space-y-2">
              {course.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {showCertificate && (
          <Certificate
            studentName={studentName}
            courseName="Complete Tafsir of Surah Al-Baqarah"
            completionDate={new Date().toLocaleDateString()}
            instructorName={course.instructor}
            onDownload={handleCertificateDownload}
          />
        )}
      </TabsContent>
      
      <TabsContent value="curriculum">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
            <div className="space-y-4">
              {course.curriculum.map((section, sectionIndex) => {
                const progress = getSectionProgress(sectionIndex);
                return (
                  <Collapsible
                    key={sectionIndex}
                    open={expandedSections[sectionIndex]}
                    onOpenChange={() => toggleSectionExpansion(sectionIndex)}
                  >
                    <div className="border rounded-lg overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center flex-1">
                            <div className="flex items-center mr-4">
                              {progress.completed === progress.total && progress.total > 0 ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="font-semibold text-gray-900">Section {sectionIndex + 1}: {section.title}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="mr-4">{section.duration}</span>
                                <span className="text-emerald-600">
                                  {progress.completed}/{progress.total} lessons completed
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{section.summary}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {expandedSections[sectionIndex] ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="border-t bg-gray-50 p-4">
                          {/* Subsections/Lessons */}
                          <div className="space-y-3 mb-6">
                            <h5 className="font-semibold text-gray-900 mb-3">Lessons</h5>
                            {section.subsections.map((subsection, subsectionIndex) => (
                              <div key={subsectionIndex} className="bg-white p-4 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center flex-1">
                                    <div className="flex items-center mr-3">
                                      {isSubsectionComplete(sectionIndex, subsectionIndex) ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Play className="w-4 h-4 text-emerald-600" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h6 className="font-medium text-gray-900">
                                        {subsectionIndex + 1}. {subsection.title}
                                      </h6>
                                      <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span className="mr-3">{subsection.duration}</span>
                                        {subsection.isPreview && (
                                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            Free Preview
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{subsection.summary}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onVideoPlay(subsection.videoUrl, sectionIndex, subsectionIndex);
                                    }}
                                    className="hover:bg-emerald-50"
                                  >
                                    <Play className="w-4 h-4 text-emerald-600" />
                                  </Button>
                                </div>
                                
                                {/* Instructor Notes for each subsection */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <h6 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Instructor Notes
                                  </h6>
                                  <p className="text-sm text-gray-600 italic">{subsection.instructorNotes}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Section Resources */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border">
                              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                                Section Resources ({section.resources.length})
                              </h5>
                              {section.resources.length > 0 ? (
                                <div className="space-y-2">
                                  {section.resources.slice(0, 3).map((resource) => (
                                    <div key={resource.id} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700 truncate">{resource.title}</span>
                                      <span className="text-gray-500 text-xs">{resource.size}</span>
                                    </div>
                                  ))}
                                  {section.resources.length > 3 && (
                                    <p className="text-xs text-gray-500">
                                      +{section.resources.length - 3} more resources
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No resources available</p>
                              )}
                            </div>

                            {/* Section Quiz */}
                            <div className="bg-white p-4 rounded-lg border">
                              <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Section Quiz
                              </h5>
                              <p className="text-sm text-gray-600 mb-3">{section.quiz.title}</p>
                              <p className="text-xs text-gray-500">
                                {section.quiz.questions.length} questions • 70% to pass
                              </p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="resources">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6">All Course Resources</h3>
            <div className="space-y-6">
              {course.curriculum.map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-3">Section {index + 1}: {section.title}</h4>
                  <DownloadableResources resources={section.resources} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="quiz">
        <div className="space-y-6">
          {course.curriculum.map((section, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Section {index + 1}: {section.title} - Quiz</h4>
                <Quiz
                  title={section.quiz.title}
                  questions={section.quiz.questions}
                  onComplete={(score) => handleSectionQuizComplete(index, score)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="instructor">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor}</h3>
                <p className="text-gray-600 mb-4">Islamic Scholar & Quranic Studies Expert</p>
                <p className="text-gray-700 leading-relaxed">{course.instructorBio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
            <div className="space-y-6">
              {[
                { name: "Ahmad Hassan", rating: 5, comment: "Excellent course with deep insights into Quranic interpretation. Sheikh Ali's explanations are clear and enlightening." },
                { name: "Fatima Ali", rating: 5, comment: "The historical context provided really helped me understand the verses better. Highly recommended!" },
                { name: "Hussein Mohammad", rating: 4, comment: "Great content and well-structured curriculum. The instructor is very knowledgeable." }
              ].map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold text-gray-900">{review.name}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabsSection;
