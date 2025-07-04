
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmad Hassan",
    location: "London, UK",
    rating: 5,
    text: "The depth of knowledge and clarity of explanation from the instructors is exceptional. I've gained profound insights into Quranic interpretation.",
    course: "Complete Tafsir of Surah Al-Baqarah"
  },
  {
    name: "Zainab Ali",
    location: "Toronto, Canada", 
    rating: 5,
    text: "As a working mother, the flexible schedule and quality content allowed me to deepen my Islamic knowledge at my own pace.",
    course: "Principles of Shia Fiqh"
  },
  {
    name: "Hussein Mohamad",
    location: "Sydney, Australia",
    rating: 5,
    text: "The historical accuracy and scholarly approach to teaching the life of our Imams has strengthened my faith immensely.",
    course: "Life of Imam Ali (AS)"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of learners about their transformative educational journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-emerald-200" />
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.location}
                    </div>
                    <div className="text-emerald-600 text-sm font-medium">
                      {testimonial.course}
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
