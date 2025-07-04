
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import CourseTabsSection from "@/components/CourseTabsSection";
import CourseSidebar from "@/components/CourseSidebar";
import { Clock, Users, Star, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const courseData = {
  1: {
    title: "Complete Tafsir of Surah Al-Baqarah",
    instructor: "Sheikh Ali Al-Husseini",
    duration: "24 hours",
    students: 1520,
    rating: 4.9,
    price: "$89",
    image: "photo-1466442929976-97f336a657be",
    level: "Intermediate",
    category: "Quran Studies",
    description: "A comprehensive study of Surah Al-Baqarah, the longest chapter of the Quran. This course provides detailed tafsir (interpretation) covering historical context, linguistic analysis, and practical applications for modern life.",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    whatYouLearn: [
      "Deep understanding of Quranic verses and their meanings",
      "Historical context of revelation (Asbab al-Nuzul)",
      "Arabic linguistic analysis and grammar",
      "Practical applications in daily life",
      "Comparative analysis with other Quranic chapters",
      "Scholarly interpretations from Shia perspective"
    ],
    curriculum: [
      { 
        title: "Introduction to Surah Al-Baqarah", 
        duration: "6 hours",
        summary: "An overview of Surah Al-Baqarah, its historical significance, and foundational concepts.",
        resources: [
          {
            id: "intro-1",
            title: "Introduction Slides",
            type: "pdf" as const,
            size: "1.2 MB",
            downloadUrl: "/resources/intro-slides.pdf"
          },
          {
            id: "intro-2",
            title: "Chapter Overview Chart",
            type: "image" as const,
            size: "800 KB",
            downloadUrl: "/resources/chapter-overview.jpg"
          }
        ],
        quiz: {
          title: "Introduction Assessment",
          questions: [
            {
              id: "intro-q1",
              question: "What makes Surah Al-Baqarah unique among Quranic chapters?",
              options: ["It's the longest chapter", "It contains the most stories", "It was revealed first", "It has the most verses about prayer"],
              correctAnswer: 0,
              explanation: "Surah Al-Baqarah is the longest chapter in the Quran with 286 verses."
            }
          ]
        },
        subsections: [
          {
            title: "Background and Context of Revelation",
            duration: "2 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            isPreview: true,
            summary: "Understanding the historical context and circumstances of revelation.",
            instructorNotes: "Focus on the Medinan period and the establishment of the Muslim community."
          },
          {
            title: "Structure and Themes Overview",
            duration: "2 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            isPreview: true,
            summary: "Exploring the major themes and organizational structure of the chapter.",
            instructorNotes: "Emphasize the interconnectedness of various topics within the surah."
          },
          {
            title: "Significance in Islamic Tradition",
            duration: "2 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            isPreview: false,
            summary: "The special status and importance of this chapter in Islamic scholarship.",
            instructorNotes: "Discuss the prophetic traditions regarding the virtues of this chapter."
          }
        ]
      },
      { 
        title: "The Opening Verses (1-29)", 
        duration: "9 hours",
        summary: "Deep dive into the opening verses, exploring guidance, righteousness, and misguidance.",
        resources: [
          {
            id: "open-1",
            title: "Verses 1-29 Arabic Text with Tajweed",
            type: "pdf" as const,
            size: "2.1 MB",
            downloadUrl: "/resources/verses-1-29-tajweed.pdf"
          },
          {
            id: "open-2",
            title: "Linguistic Analysis Notes",
            type: "document" as const,
            size: "1.5 MB",
            downloadUrl: "/resources/linguistic-analysis-1-29.docx"
          }
        ],
        quiz: {
          title: "Opening Verses Quiz",
          questions: [
            {
              id: "open-q1",
              question: "What are the three categories of people mentioned in the opening verses?",
              options: ["Believers, disbelievers, hypocrites", "Arabs, non-Arabs, converts", "Rich, poor, middle class", "Young, old, middle-aged"],
              correctAnswer: 0,
              explanation: "The opening verses categorize people into believers (muttaqin), disbelievers (kafirun), and hypocrites (munafiqun)."
            }
          ]
        },
        subsections: [
          {
            title: "The Mysterious Letters (Alif Lam Meem)",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            isPreview: false,
            summary: "Exploring the meaning and significance of the disconnected letters.",
            instructorNotes: "Present different scholarly interpretations while emphasizing the mystery."
          },
          {
            title: "Description of the Righteous (Al-Muttaqin)",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            isPreview: false,
            summary: "Detailed analysis of the characteristics of the God-conscious believers.",
            instructorNotes: "Connect these qualities to practical daily life applications."
          },
          {
            title: "The Hypocrites (Al-Munafiqin)",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            isPreview: false,
            summary: "Understanding hypocrisy and its manifestations in religious life.",
            instructorNotes: "Handle sensitively - focus on self-reflection rather than judgment of others."
          }
        ]
      },
      { 
        title: "Stories of the Prophets (30-103)", 
        duration: "12 hours",
        summary: "Exploration of Adam, Moses, and other prophets with lessons for contemporary life.",
        resources: [
          {
            id: "stories-1",
            title: "Prophetic Stories Timeline",
            type: "image" as const,
            size: "2.3 MB",
            downloadUrl: "/resources/prophets-timeline.jpg"
          },
          {
            id: "stories-2",
            title: "Historical Context Document",
            type: "pdf" as const,
            size: "3.1 MB",
            downloadUrl: "/resources/historical-context-prophets.pdf"
          }
        ],
        quiz: {
          title: "Stories of Prophets Assessment",
          questions: [
            {
              id: "stories-q1",
              question: "Which prophet's story is most extensively covered in these verses?",
              options: ["Adam", "Moses", "Abraham", "Jesus"],
              correctAnswer: 1,
              explanation: "The story of Moses (Musa) and the Children of Israel is the most extensively covered in this section."
            }
          ]
        },
        subsections: [
          {
            title: "Adam and the Fall from Paradise",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            isPreview: false,
            summary: "The creation of Adam, the test in Paradise, and lessons about human nature.",
            instructorNotes: "Emphasize themes of repentance, forgiveness, and human responsibility."
          },
          {
            title: "Moses and Pharaoh - Part 1",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            isPreview: false,
            summary: "The confrontation between Moses and Pharaoh, miracles and signs.",
            instructorNotes: "Draw parallels to standing up against oppression in any era."
          },
          {
            title: "Moses and Pharaoh - Part 2",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            isPreview: false,
            summary: "The exodus from Egypt and the trials in the wilderness.",
            instructorNotes: "Focus on themes of liberation, gratitude, and community building."
          },
          {
            title: "The Children of Israel's Covenant",
            duration: "3 hours",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            isPreview: false,
            summary: "The covenant at Mount Sinai and the responsibilities of a chosen community.",
            instructorNotes: "Discuss the concept of covenant and its relevance to Muslim community."
          }
        ]
      }
    ],
    instructorBio: "Sheikh Ali Al-Husseini is a renowned Islamic scholar with over 20 years of experience in Quranic studies. He holds advanced degrees in Islamic theology and Arabic literature from Al-Azhar University and has authored several books on Quranic interpretation.",
    requirements: [
      "Basic understanding of Arabic script (preferred)",
      "Open mind and willingness to learn",
      "Access to a copy of the Quran",
      "Notebook for taking notes"
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const course = courseData[Number(id) as keyof typeof courseData];
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedSubsection, setSelectedSubsection] = useState<number | null>(null);
  const [courseProgress, setCourseProgress] = useState<{[key: string]: boolean}>({});

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course-${id}-progress`);
    if (savedProgress) {
      setCourseProgress(JSON.parse(savedProgress));
    }
  }, [id]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`course-${id}-progress`, JSON.stringify(courseProgress));
  }, [courseProgress, id]);

  // Calculate total progress
  const getTotalProgress = () => {
    if (!course) return { completed: 0, total: 0 };
    
    let totalSubsections = 0;
    let completedSubsections = 0;
    
    course.curriculum.forEach((section, sectionIndex) => {
      section.subsections.forEach((_, subsectionIndex) => {
        totalSubsections++;
        if (courseProgress[`${sectionIndex}-${subsectionIndex}`]) {
          completedSubsections++;
        }
      });
    });
    
    return { completed: completedSubsections, total: totalSubsections };
  };

  const getResumeInfo = () => {
    if (!course) return null;
    
    for (let sectionIndex = 0; sectionIndex < course.curriculum.length; sectionIndex++) {
      const section = course.curriculum[sectionIndex];
      for (let subsectionIndex = 0; subsectionIndex < section.subsections.length; subsectionIndex++) {
        if (!courseProgress[`${sectionIndex}-${subsectionIndex}`]) {
          return {
            sectionIndex,
            subsectionIndex,
            sectionTitle: section.title,
            subsectionTitle: section.subsections[subsectionIndex].title
          };
        }
      }
    }
    return null;
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-xl text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleVideoPlay = (videoUrl: string, sectionIndex: number, subsectionIndex: number) => {
    setCurrentVideo(videoUrl);
    setSelectedSection(sectionIndex);
    setSelectedSubsection(subsectionIndex);
  };

  const handlePreviewPlay = () => {
    setCurrentVideo(course.previewVideo);
    setSelectedSection(null);
    setSelectedSubsection(null);
  };

  const markSubsectionComplete = (sectionIndex: number, subsectionIndex: number) => {
    setCourseProgress(prev => ({
      ...prev,
      [`${sectionIndex}-${subsectionIndex}`]: true
    }));
  };

  const totalProgress = getTotalProgress();
  const resumeInfo = getResumeInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="mb-4">
                <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students} students
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {course.rating} rating
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Online
                </div>
              </div>

              {/* Progress indicator */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm text-gray-600">
                    {totalProgress.completed}/{totalProgress.total} lessons completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress.total > 0 ? (totalProgress.completed / totalProgress.total) * 100 : 0}%` }}
                  ></div>
                </div>
                {resumeInfo && (
                  <p className="text-sm text-emerald-600 mt-2">
                    Resume: {resumeInfo.sectionTitle} - {resumeInfo.subsectionTitle}
                  </p>
                )}
              </div>
            </div>

            <VideoPlayer
              currentVideo={currentVideo}
              selectedModule={selectedSection}
              selectedSubsection={selectedSubsection}
              course={course}
              onPreviewPlay={handlePreviewPlay}
              onMarkComplete={markSubsectionComplete}
              courseProgress={courseProgress}
            />

            <CourseTabsSection
              course={course}
              onVideoPlay={handleVideoPlay}
              studentName={user?.name || "Student"}
              courseProgress={courseProgress}
              onMarkComplete={markSubsectionComplete}
            />
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar course={course} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
