
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: 'student' | 'instructor';
  content: string;
  timestamp: string;
  senderName: string;
}

interface InstructorMessagingProps {
  courseId: string;
  instructorName: string;
  studentName: string;
}

const InstructorMessaging = ({ courseId, instructorName, studentName }: InstructorMessagingProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: 'instructor',
      content: "Welcome to the course! Feel free to ask any questions about the curriculum.",
      timestamp: "2024-01-15 10:00",
      senderName: instructorName
    },
    {
      id: "2",
      sender: 'student',
      content: "Thank you! I have a question about the historical context of Surah Al-Baqarah.",
      timestamp: "2024-01-15 14:30",
      senderName: studentName
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'student',
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      senderName: studentName
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the instructor."
    });

    // Simulate instructor reply after 3 seconds
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'instructor',
        content: "Thank you for your question. I'll address this in our next session and provide detailed context.",
        timestamp: new Date().toLocaleString(),
        senderName: instructorName
      };
      setMessages(prev => [...prev, reply]);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Message Instructor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.sender === 'instructor' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}>
                      {message.senderName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${message.sender === 'student' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'student' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorMessaging;
