
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Paperclip, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  isCurrentUser?: boolean;
}

interface LiveGroupChatProps {
  groupId: string;
  currentUser: string;
}

const LiveGroupChat = ({ groupId, currentUser }: LiveGroupChatProps) => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Ahmed Hassan",
      content: "Assalamu alaikum everyone! Ready for today's study session?",
      timestamp: "10:30 AM",
      type: "text"
    },
    {
      id: "2",
      sender: "Fatima Ali",
      content: "Wa alaikum assalam! Yes, I've prepared the notes for verses 20-25.",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: "3",
      sender: "System",
      content: "Omar Khan joined the chat",
      timestamp: "10:35 AM",
      type: "system"
    },
    {
      id: "4",
      sender: "Omar Khan",
      content: "Sorry I'm late! What did I miss?",
      timestamp: "10:36 AM",
      type: "text"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate other users typing
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate a response
        const responses = [
          "JazakAllahu khair for sharing!",
          "That's a great point!",
          "Can you elaborate on that?",
          "I found that helpful too."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "Ahmed Hassan",
          content: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "text"
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality would be implemented here."
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Live Group Chat
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
            4 online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'system' ? (
                <div className="text-center w-full">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              ) : (
                <div className={`flex items-start space-x-2 max-w-[70%] ${message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {message.sender}
                      </span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <div className={`rounded-lg px-3 py-2 max-w-full break-words ${
                      message.isCurrentUser 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">A</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFileUpload}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveGroupChat;
