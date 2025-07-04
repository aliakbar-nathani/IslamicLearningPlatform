
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
  createdAt: string;
  price: number;
}

const CourseManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Complete Tafsir of Surah Al-Baqarah",
      instructor: "Sheikh Ali Al-Husseini",
      students: 245,
      status: 'active',
      category: "Tafsir",
      createdAt: "2024-01-10",
      price: 199
    },
    {
      id: "2",
      title: "Arabic Grammar Fundamentals",
      instructor: "Dr. Sarah Ahmed",
      students: 180,
      status: 'active',
      category: "Language",
      createdAt: "2024-01-15",
      price: 149
    },
    {
      id: "3",
      title: "Hadith Sciences Introduction",
      instructor: "Sheikh Omar Ibn Malik",
      students: 95,
      status: 'draft',
      category: "Hadith",
      createdAt: "2024-01-20",
      price: 179
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    category: "",
    price: "",
    description: ""
  });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const course: Course = {
      id: (courses.length + 1).toString(),
      title: newCourse.title,
      instructor: newCourse.instructor,
      students: 0,
      status: 'draft',
      category: newCourse.category,
      createdAt: new Date().toISOString().split('T')[0],
      price: parseInt(newCourse.price) || 0
    };

    setCourses([...courses, course]);
    setNewCourse({ title: "", instructor: "", category: "", price: "", description: "" });
    setIsAddCourseOpen(false);
    
    toast({
      title: "Success",
      description: "Course created successfully"
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
    toast({
      title: "Success",
      description: "Course deleted successfully"
    });
  };

  const handleStatusChange = (courseId: string, newStatus: Course['status']) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, status: newStatus } : course
    ));
    toast({
      title: "Success",
      description: `Course status updated to ${newStatus}`
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Course Management
          <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                    placeholder="Enter instructor name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewCourse({...newCourse, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tafsir">Tafsir</SelectItem>
                      <SelectItem value="Hadith">Hadith</SelectItem>
                      <SelectItem value="Fiqh">Fiqh</SelectItem>
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Enter course description"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleAddCourse} className="flex-1">Create Course</Button>
                  <Button variant="outline" onClick={() => setIsAddCourseOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>
                  <Select
                    value={course.status}
                    onValueChange={(value: Course['status']) => handleStatusChange(course.id, value)}
                  >
                    <SelectTrigger className="w-24">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>${course.price}</TableCell>
                <TableCell>{course.createdAt}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseManagement;
