
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  MessageCircle, 
  PenTool,
  BarChart3,
  Settings,
  Hand,
  Share2
} from "lucide-react";
import VideoConference from "./VideoConference";
import InteractiveWhiteboard from "./InteractiveWhiteboard";
import LiveQA from "./LiveQA";
import LivePolls from "./LivePolls";
import BreakoutRooms from "./BreakoutRooms";

interface LiveClassroomProps {
  classId: string;
  className: string;
  instructor: string;
  isInstructor: boolean;
  studentName: string;
}

const LiveClassroom = ({ 
  classId, 
  className, 
  instructor, 
  isInstructor = false,
  studentName 
}: LiveClassroomProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState([
    { id: "1", name: instructor, role: "instructor", isVideoOn: true, isAudioOn: true },
    { id: "2", name: "Ahmad Hassan", role: "student", isVideoOn: true, isAudioOn: true },
    { id: "3", name: "Fatima Ali", role: "student", isVideoOn: false, isAudioOn: true },
    { id: "4", name: studentName, role: "student", isVideoOn: true, isAudioOn: true }
  ]);

  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleAudio = () => setIsAudioOn(!isAudioOn);
  const toggleHandRaise = () => setIsHandRaised(!isHandRaised);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{className}</CardTitle>
                <p className="text-gray-600">Instructor: {instructor}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  Live • {participants.length} participants
                </Badge>
                {isInstructor && (
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Screen
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Video Conference Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <VideoConference 
                  participants={participants}
                  isVideoOn={isVideoOn}
                  isAudioOn={isAudioOn}
                  isInstructor={isInstructor}
                />
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              {!isInstructor && (
                <Button
                  variant={isHandRaised ? "secondary" : "outline"}
                  size="lg"
                  onClick={toggleHandRaise}
                >
                  <Hand className="w-5 h-5" />
                  {isHandRaised ? "Lower Hand" : "Raise Hand"}
                </Button>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="participants" className="h-[600px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="participants">
                  <Users className="w-4 h-4 mr-1" />
                  People
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="mt-4">
                <Card className="h-[550px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Participants ({participants.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{participant.name}</p>
                            {participant.role === 'instructor' && (
                              <Badge variant="outline" className="text-xs">Host</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {participant.isVideoOn ? 
                            <Video className="w-4 h-4 text-green-600" /> : 
                            <VideoOff className="w-4 h-4 text-gray-400" />
                          }
                          {participant.isAudioOn ? 
                            <Mic className="w-4 h-4 text-green-600" /> : 
                            <MicOff className="w-4 h-4 text-gray-400" />
                          }
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <Card className="h-[550px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Class Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-3">
                    <div className="space-y-2">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-blue-600 font-medium">{instructor}</p>
                        <p className="text-sm">Welcome everyone! Let's start today's lesson.</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-600 font-medium">Ahmad Hassan</p>
                        <p className="text-sm">Assalamu alaikum, ready to learn!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bottom Tools */}
        <Tabs defaultValue="whiteboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="whiteboard">
              <PenTool className="w-4 h-4 mr-2" />
              Whiteboard
            </TabsTrigger>
            <TabsTrigger value="qa">
              <MessageCircle className="w-4 h-4 mr-2" />
              Q&A
            </TabsTrigger>
            <TabsTrigger value="polls">
              <BarChart3 className="w-4 h-4 mr-2" />
              Polls
            </TabsTrigger>
            <TabsTrigger value="breakout">
              <Users className="w-4 h-4 mr-2" />
              Breakout Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whiteboard">
            <InteractiveWhiteboard 
              classId={classId}
              isInstructor={isInstructor}
            />
          </TabsContent>

          <TabsContent value="qa">
            <LiveQA 
              classId={classId}
              isInstructor={isInstructor}
              studentName={studentName}
            />
          </TabsContent>

          <TabsContent value="polls">
            <LivePolls 
              classId={classId}
              isInstructor={isInstructor}
              studentName={studentName}
            />
          </TabsContent>

          <TabsContent value="breakout">
            <BreakoutRooms 
              classId={classId}
              isInstructor={isInstructor}
              participants={participants}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveClassroom;
