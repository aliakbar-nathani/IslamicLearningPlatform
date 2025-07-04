
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Islamic Academy</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering hearts and minds through authentic Shia Islamic education. Join our global community of learners.
            </p>
            <div className="flex gap-4">
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-emerald-600 hover:border-emerald-600">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-emerald-600 hover:border-emerald-600">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-emerald-600 hover:border-emerald-600">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-emerald-600 hover:border-emerald-600">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'All Courses', 'Instructors', 'Pricing', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Categories</h3>
            <ul className="space-y-3">
              {['Quran Studies', 'Hadith & Sunnah', 'Fiqh & Jurisprudence', 'Islamic History', 'Arabic Language'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">info@islamicacademy.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">Online Learning Platform</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">
            © 2024 Islamic Academy. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
