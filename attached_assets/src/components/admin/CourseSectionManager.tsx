
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, FileText, Edit, Trash2, Upload, BookOpen as QuizIcon } from "lucide-react";
import { CourseData, CourseSection, CourseMaterial } from "./CourseCreationWizard";
import SectionQuizBuilder from "./SectionQuizBuilder";

interface CourseSectionManagerProps {
  courseData: CourseData;
  setCourseData: (data: CourseData) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const CourseSectionManager = ({ courseData, setCourseData, onNext, onPrevious }: CourseSectionManagerProps) => {
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
    videoUrl: ""
  });

  const handleAddSection = () => {
    const section: CourseSection = {
      id: Date.now().toString(),
      title: newSection.title,
      description: newSection.description,
      videoFile: null,
      videoUrl: newSection.videoUrl,
      duration: "0:00",
      materials: [],
      instructorNotes: "",
      order: courseData.sections.length + 1
    };

    setCourseData({
      ...courseData,
      sections: [...courseData.sections, section]
    });

    setNewSection({ title: "", description: "", videoUrl: "" });
    setIsAddSectionOpen(false);
  };

  const handleDeleteSection = (sectionId: string) => {
    setCourseData({
      ...courseData,
      sections: courseData.sections.filter(section => section.id !== sectionId)
    });
  };

  const handleAddMaterial = (sectionId: string) => {
    // Mock file upload - in real app would handle actual file upload
    const material: CourseMaterial = {
      id: Date.now().toString(),
      title: `Material ${Date.now()}`,
      name: `Material ${Date.now()}.pdf`,
      file: null,
      type: 'pdf',
      url: `https://example.com/material-${Date.now()}.pdf`,
      size: 1024000
    };

    setCourseData({
      ...courseData,
      sections: courseData.sections.map(section =>
        section.id === sectionId
          ? { ...section, materials: [...section.materials, material] }
          : section
      )
    });
  };

  const handleVideoUpload = (sectionId: string) => {
    // Mock video upload
    const videoUrl = `https://example.com/video-${Date.now()}.mp4`;
    
    setCourseData({
      ...courseData,
      sections: courseData.sections.map(section =>
        section.id === sectionId
          ? { ...section, videoUrl }
          : section
      )
    });
  };

  const getFileTypeIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Sections</h3>
        <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input
                  id="sectionTitle"
                  value={newSection.title}
                  onChange={(e) => setNewSection({...newSection, title: e.target.value})}
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <Label htmlFor="sectionDescription">Description</Label>
                <Textarea
                  id="sectionDescription"
                  value={newSection.description}
                  onChange={(e) => setNewSection({...newSection, description: e.target.value})}
                  placeholder="Enter section description"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleAddSection} disabled={!newSection.title}>
                  Add Section
                </Button>
                <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {courseData.sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                    Section {index + 1}
                  </span>
                  <span>{section.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{section.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Section Video
                  </h4>
                  {section.videoUrl ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-2">Video Uploaded</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVideoUpload(section.id)}
                      >
                        Change Video
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVideoUpload(section.id)}
                      >
                        Upload Video
                      </Button>
                    </div>
                  )}
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Materials ({section.materials.length})
                  </h4>
                  <div className="space-y-2 mb-2">
                    {section.materials.slice(0, 2).map((material) => (
                      <div key={material.id} className="flex items-center text-sm">
                        {getFileTypeIcon(material.type)}
                        <span className="ml-2 truncate">{material.name}</span>
                      </div>
                    ))}
                    {section.materials.length > 2 && (
                      <p className="text-xs text-gray-500">+{section.materials.length - 2} more</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddMaterial(section.id)}
                  >
                    Add Material
                  </Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <QuizIcon className="w-4 h-4 mr-2" />
                    Section Quiz
                  </h4>
                  {section.quiz ? (
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-2">
                        {section.quiz.questions.length} Questions
                      </Badge>
                      <br />
                      <SectionQuizBuilder
                        sectionId={section.id}
                        quiz={section.quiz}
                        onQuizUpdate={(quiz) => {
                          setCourseData({
                            ...courseData,
                            sections: courseData.sections.map(s =>
                              s.id === section.id ? { ...s, quiz } : s
                            )
                          });
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">No quiz added</p>
                      <SectionQuizBuilder
                        sectionId={section.id}
                        onQuizUpdate={(quiz) => {
                          setCourseData({
                            ...courseData,
                            sections: courseData.sections.map(s =>
                              s.id === section.id ? { ...s, quiz } : s
                            )
                          });
                        }}
                      />
                    </div>
                  )}
                </Card>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courseData.sections.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No sections added yet</p>
          <p className="text-sm text-gray-400">Add sections to build your course content</p>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Basic Info
        </Button>
        <Button
          onClick={onNext}
          disabled={courseData.sections.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Next: Review & Publish
        </Button>
      </div>
    </div>
  );
};

export default CourseSectionManager;
