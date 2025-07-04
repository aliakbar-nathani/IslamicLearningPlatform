
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Globe, 
  Award, 
  Heart, 
  Target, 
  CheckCircle,
  Star,
  Calendar,
  MessageCircle
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Active Students", value: "25,000+" },
    { icon: BookOpen, label: "Courses Available", value: "150+" },
    { icon: Globe, label: "Countries Reached", value: "80+" },
    { icon: Award, label: "Expert Instructors", value: "50+" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authentic Islamic Education",
      description: "We provide education rooted in authentic Islamic sources with a focus on Shia Islamic teachings and scholarship."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Breaking geographical barriers to make quality Islamic education accessible to Muslims worldwide."
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Fostering a supportive community where students learn together and grow in their faith."
    },
    {
      icon: Target,
      title: "Practical Application",
      description: "Connecting traditional Islamic knowledge with modern life applications and contemporary challenges."
    }
  ];

  const milestones = [
    { year: "2018", event: "Islamic Academy Founded", description: "Started with a vision to democratize Islamic education" },
    { year: "2019", event: "First 1000 Students", description: "Reached our first major milestone in student enrollment" },
    { year: "2020", event: "Global Expansion", description: "Extended our reach to 50+ countries worldwide" },
    { year: "2021", event: "Expert Faculty Network", description: "Assembled world-class team of Islamic scholars" },
    { year: "2022", event: "Advanced Learning Platform", description: "Launched interactive learning features and live classes" },
    { year: "2023", event: "25,000+ Students", description: "Became one of the leading online Islamic education platforms" },
    { year: "2024", event: "AI-Enhanced Learning", description: "Introduced personalized learning paths and AI tutoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Islamic Academy</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Empowering hearts and minds through authentic Shia Islamic education. 
              We are dedicated to preserving and sharing the profound wisdom of Islam 
              with learners around the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To provide accessible, authentic, and comprehensive Islamic education that nurtures 
                spiritual growth, intellectual development, and practical understanding of Islam. 
                We strive to bridge the gap between traditional Islamic scholarship and modern learning needs.
              </p>
              <div className="space-y-4">
                {[
                  "Preserve and transmit authentic Islamic knowledge",
                  "Make quality Islamic education globally accessible",
                  "Foster a community of lifelong Islamic learners",
                  "Bridge traditional scholarship with modern pedagogy"
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="Islamic Academy Mission"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our approach to Islamic education and community building
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a global Islamic education platform
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <Card className={`w-full max-w-md ${index % 2 === 0 ? 'mr-auto lg:mr-8' : 'ml-auto lg:ml-8'} group hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-emerald-600 font-bold text-lg">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Learning Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Embark on your Islamic learning journey with us. Connect with scholars, 
            engage with fellow students, and deepen your understanding of Islam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Courses
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
