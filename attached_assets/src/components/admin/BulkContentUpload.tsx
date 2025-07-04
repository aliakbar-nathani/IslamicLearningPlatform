
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Video, Image, File, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadItem {
  id: string;
  name: string;
  type: 'video' | 'document' | 'image' | 'audio' | 'other';
  size: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  courseId?: string;
}

const BulkContentUpload = () => {
  const { toast } = useToast();
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");

  const courses = [
    { id: "1", title: "Complete Tafsir of Surah Al-Baqarah" },
    { id: "2", title: "Arabic Grammar Fundamentals" },
    { id: "3", title: "Hadith Sciences Introduction" },
    { id: "4", title: "Islamic History Essentials" }
  ];

  const getFileIcon = (type: UploadItem['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'document':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600" />;
      case 'audio':
        return <File className="w-5 h-5 text-purple-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFileType = (filename: string): UploadItem['type'] => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) return 'document';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
    if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio';
    return 'other';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newItems: UploadItem[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file.name),
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'pending',
      progress: 0,
      courseId: selectedCourse
    }));

    setUploadItems(prev => [...prev, ...newItems]);
  };

  const simulateUpload = (itemId: string) => {
    setUploadItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'uploading' } : item
    ));

    const interval = setInterval(() => {
      setUploadItems(prev => prev.map(item => {
        if (item.id === itemId) {
          const newProgress = Math.min(item.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...item, progress: 100, status: 'completed' };
          }
          return { ...item, progress: newProgress };
        }
        return item;
      }));
    }, 500);
  };

  const handleStartUpload = () => {
    if (uploadItems.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCourse) {
      toast({
        title: "No course selected",
        description: "Please select a course for the content",
        variant: "destructive"
      });
      return;
    }

    uploadItems.forEach(item => {
      if (item.status === 'pending') {
        simulateUpload(item.id);
      }
    });

    toast({
      title: "Upload Started",
      description: `Starting upload of ${uploadItems.filter(item => item.status === 'pending').length} files`
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getStatusColor = (status: UploadItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = uploadItems.filter(item => item.status === 'completed').length;
  const totalCount = uploadItems.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Content Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="files">Select Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Upload Description</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this upload batch..."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              rows={3}
            />
          </div>

          {uploadItems.length > 0 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {completedCount} of {totalCount} files uploaded
              </div>
              <Button 
                onClick={handleStartUpload}
                disabled={uploadItems.every(item => item.status !== 'pending')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Start Upload
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {uploadItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{item.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={item.status === 'uploading'}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.type}</span>
                    </div>
                    {item.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={item.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{Math.round(item.progress)}% complete</p>
                      </div>
                    )}
                    {item.status === 'completed' && (
                      <div className="flex items-center mt-2 text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Upload completed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Supported File Types</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Videos: MP4, AVI, MOV, WMV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Documents: PDF, DOC, DOCX, TXT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 text-green-600" />
                  <span>Images: JPG, PNG, GIF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <File className="w-4 h-4 text-purple-600" />
                  <span>Audio: MP3, WAV, OGG</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">File Size Limits</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Maximum file size: 500MB per file</p>
                <p>• Maximum batch size: 50 files</p>
                <p>• Video files are automatically compressed</p>
                <p>• PDF files are optimized for web viewing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkContentUpload;
