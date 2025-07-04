
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, BookOpen, Users, Calendar, Award, MessageCircle } from "lucide-react";

const instructors = [
  {
    name: "Sheikh Ali Al-Husseini",
    title: "Quranic Studies Expert",
    experience: "15+ years",
    students: 5000,
    courses: 12,
    rating: 4.9,
    bio: "Renowned scholar specializing in Quranic interpretation and Arabic linguistics. Sheikh Ali has dedicated his life to making the profound wisdom of the Quran accessible to modern learners.",
    specializations: ["Tafsir", "Arabic Grammar", "Quranic Sciences"],
    education: "PhD in Islamic Studies, Al-Azhar University",
    languages: ["Arabic", "English", "Urdu"],
    achievements: [
      "Author of 'Modern Tafsir Methodology'",
      "International Quran Recitation Judge",
      "Featured Speaker at Global Islamic Conferences"
    ]
  },
  {
    name: "Dr. Fatima Zahra",
    title: "Fiqh & Jurisprudence Scholar",
    experience: "12+ years", 
    students: 3200,
    courses: 8,
    rating: 4.8,
    bio: "Expert in Islamic law and contemporary jurisprudential issues. Dr. Fatima bridges classical Islamic jurisprudence with modern-day applications.",
    specializations: ["Islamic Law", "Family Jurisprudence", "Contemporary Issues"],
    education: "PhD in Islamic Jurisprudence, University of Medina",
    languages: ["Arabic", "English", "Persian"],
    achievements: [
      "Legal Consultant for Islamic Banking",
      "Published 50+ Research Papers",
      "Women's Rights in Islam Advocate"
    ]
  },
  {
    name: "Prof. Hassan Najafi",
    title: "Islamic History Scholar",
    experience: "20+ years",
    students: 7500,
    courses: 15,
    rating: 4.9,
    bio: "Distinguished historian focusing on early Islamic period and the lives of the Imams. Prof. Hassan brings historical narratives to life with engaging storytelling.",
    specializations: ["Early Islamic History", "Imam's Biography", "Historical Analysis"],
    education: "PhD in Islamic History, University of Tehran",
    languages: ["Arabic", "English", "Persian", "Turkish"],
    achievements: [
      "Author of 'The Golden Age of Islam'",
      "Documentary Consultant for BBC",
      "Historical Research Institute Director"
    ]
  },
  {
    name: "Dr. Maryam Al-Zahra",
    title: "Arabic Language & Literature",
    experience: "10+ years",
    students: 2800,
    courses: 6,
    rating: 4.7,
    bio: "Passionate educator specializing in Arabic language instruction and classical literature. Dr. Maryam makes Arabic learning accessible and enjoyable for all levels.",
    specializations: ["Arabic Grammar", "Classical Poetry", "Modern Arabic"],
    education: "PhD in Arabic Literature, Cairo University",
    languages: ["Arabic", "English", "French"],
    achievements: [
      "Developed Interactive Arabic Curriculum",
      "Poetry Translation Award Winner",
      "Cultural Exchange Program Director"
    ]
  },
  {
    name: "Sheikh Omar Ibn Rashid",
    title: "Hadith & Sunnah Expert",
    experience: "18+ years",
    students: 4500,
    courses: 10,
    rating: 4.8,
    bio: "Authority on Prophetic traditions and their authentic transmission. Sheikh Omar specializes in hadith sciences and their practical applications in daily life.",
    specializations: ["Hadith Sciences", "Sunnah Studies", "Hadith Authentication"],
    education: "PhD in Hadith Studies, Islamic University of Medina",
    languages: ["Arabic", "English", "Malay"],
    achievements: [
      "Hadith Authentication Committee Member",
      "Author of 'Sahih Hadith Collection'",
      "International Hadith Conference Organizer"
    ]
  },
  {
    name: "Dr. Zaynab Al-Kubra",
    title: "Islamic Philosophy & Ethics",
    experience: "14+ years",
    students: 3600,
    courses: 9,
    rating: 4.9,
    bio: "Philosopher and ethicist exploring the intersection of Islamic thought with contemporary moral challenges. Dr. Zaynab guides students through complex philosophical concepts.",
    specializations: ["Islamic Philosophy", "Ethics", "Comparative Religion"],
    education: "PhD in Islamic Philosophy, University of Oxford",
    languages: ["Arabic", "English", "German"],
    achievements: [
      "Islamic Ethics Research Fellow",
      "Interfaith Dialogue Expert",
      "Philosophy of Religion Award Recipient"
    ]
  }
];

const Instructors = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Distinguished Scholars
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from world-renowned Islamic scholars with decades of teaching experience and expertise in their respective fields
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="space-y-4 flex-grow">
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-4">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-emerald-600 font-semibold mb-2">
                      {instructor.title}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {instructor.bio}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-1">
                        {instructor.specializations.map((spec, idx) => (
                          <span key={idx} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Education</h4>
                      <p className="text-gray-600 text-xs">{instructor.education}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Languages</h4>
                      <p className="text-gray-600 text-xs">{instructor.languages.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center py-3 border-t border-gray-100">
                    <div>
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full mx-auto mb-1">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{instructor.courses}</div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{instructor.students.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-sm font-bold text-gray-900">{instructor.rating}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {instructor.experience} experience
                    </span>
                    <span className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Expert
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-emerald-50 hover:border-emerald-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View Profile & Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community of Learners
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our instructors are committed to providing personalized attention and guidance to help you achieve your Islamic learning goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Users className="w-5 h-5 mr-2" />
              Become a Student
            </Button>
            <Button size="lg" variant="outline" className="hover:bg-emerald-50">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Our Scholars
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instructors;
