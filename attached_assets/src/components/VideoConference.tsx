
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, Pin, Maximize2 } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

interface VideoConferenceProps {
  participants: Participant[];
  isVideoOn: boolean;
  isAudioOn: boolean;
  isInstructor: boolean;
}

const VideoConference = ({ 
  participants, 
  isVideoOn, 
  isAudioOn, 
  isInstructor 
}: VideoConferenceProps) => {
  const [pinnedParticipant, setPinnedParticipant] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const instructor = participants.find(p => p.role === 'instructor');
  const students = participants.filter(p => p.role === 'student');

  const mainParticipant = pinnedParticipant 
    ? participants.find(p => p.id === pinnedParticipant)
    : instructor;

  const otherParticipants = participants.filter(p => p.id !== mainParticipant?.id);

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {mainParticipant && (
          <div className="w-full h-full relative bg-gray-800 flex items-center justify-center">
            {mainParticipant.isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-4xl font-bold">
                      {mainParticipant.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="text-xl font-semibold">{mainParticipant.name}</p>
                  <p className="text-emerald-100 capitalize">{mainParticipant.role}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-semibold">{mainParticipant.name}</p>
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {mainParticipant.name}
              </div>
              {!mainParticipant.isAudioOn && (
                <div className="bg-red-500 p-1 rounded-full">
                  <MicOff className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Pin/Fullscreen controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => setPinnedParticipant(
                  pinnedParticipant === mainParticipant.id ? null : mainParticipant.id
                )}
              >
                <Pin className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Participant Thumbnails */}
      <div className="h-24 bg-gray-800 p-2 flex space-x-2 overflow-x-auto">
        {otherParticipants.map((participant) => (
          <Card 
            key={participant.id}
            className="flex-shrink-0 w-20 h-20 bg-gray-700 border-gray-600 cursor-pointer hover:border-emerald-500 transition-colors"
            onClick={() => setPinnedParticipant(participant.id)}
          >
            <div className="w-full h-full flex items-center justify-center relative">
              {participant.isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              {!participant.isAudioOn && (
                <div className="absolute bottom-1 right-1 bg-red-500 p-0.5 rounded-full">
                  <MicOff className="w-2 h-2 text-white" />
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 truncate rounded-b">
                {participant.name.split(' ')[0]}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoConference;
