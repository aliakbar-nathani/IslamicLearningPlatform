
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Video, Image } from "lucide-react";
import { CourseData } from "./CourseCreationWizard";

interface CourseBasicInfoProps {
  courseData: CourseData;
  setCourseData: (data: CourseData) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const CourseBasicInfo = ({ courseData, setCourseData, onNext }: CourseBasicInfoProps) => {
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: keyof CourseData, value: any) => {
    setCourseData({ ...courseData, [field]: value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleFileUpload = (type: 'thumbnail' | 'preview') => {
    // In a real app, this would handle file upload to storage
    const mockUrl = `https://example.com/${type}-${Date.now()}`;
    if (type === 'thumbnail') {
      handleInputChange('thumbnailUrl', mockUrl);
    } else {
      handleInputChange('previewVideoUrl', mockUrl);
    }
  };

  const canProceed = courseData.title && courseData.description && courseData.instructor && courseData.category;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={courseData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <Label htmlFor="instructor">Instructor *</Label>
            <Input
              id="instructor"
              value={courseData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
              placeholder="Enter instructor name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tafsir">Tafsir</SelectItem>
                <SelectItem value="Hadith">Hadith</SelectItem>
                <SelectItem value="Fiqh">Fiqh</SelectItem>
                <SelectItem value="Language">Arabic Language</SelectItem>
                <SelectItem value="History">Islamic History</SelectItem>
                <SelectItem value="Quran">Quran Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={courseData.isPaid}
              onCheckedChange={(checked) => handleInputChange('isPaid', checked)}
            />
            <Label>Paid Course</Label>
          </div>

          {courseData.isPaid && (
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="Enter price"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Course Thumbnail</Label>
            <Card className="p-4">
              <div className="flex flex-col items-center justify-center space-y-2 min-h-[120px]">
                {courseData.thumbnailUrl ? (
                  <div className="text-center">
                    <Image className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600">Thumbnail uploaded</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload course thumbnail</p>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileUpload('thumbnail')}
                >
                  {courseData.thumbnailUrl ? 'Change' : 'Upload'} Image
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Label>Preview Video (Free)</Label>
            <Card className="p-4">
              <div className="flex flex-col items-center justify-center space-y-2 min-h-[120px]">
                {courseData.previewVideoUrl ? (
                  <div className="text-center">
                    <Video className="w-8 h-8 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600">Preview video uploaded</p>
                  </div>
                ) : (
                  <>
                    <Video className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload preview video</p>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileUpload('preview')}
                >
                  {courseData.previewVideoUrl ? 'Change' : 'Upload'} Video
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Course Description *</Label>
        <Textarea
          id="description"
          value={courseData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter detailed course description"
          rows={4}
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex space-x-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button onClick={handleAddTag} variant="outline">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {courseData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
              <span>{tag}</span>
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Next: Add Sections
        </Button>
      </div>
    </div>
  );
};

export default CourseBasicInfo;
