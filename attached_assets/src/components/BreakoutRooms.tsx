
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Play, Square, Settings, UserPlus } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

interface BreakoutRoom {
  id: string;
  name: string;
  participants: Participant[];
  isActive: boolean;
  maxParticipants: number;
}

interface BreakoutRoomsProps {
  classId: string;
  isInstructor: boolean;
  participants: Participant[];
}

const BreakoutRooms = ({ classId, isInstructor, participants }: BreakoutRoomsProps) => {
  const [breakoutRooms, setBreakoutRooms] = useState<BreakoutRoom[]>([
    {
      id: "1",
      name: "Group Discussion - Verses 1-10",
      participants: [
        participants.find(p => p.name === "Ahmad Hassan") || participants[0],
        participants.find(p => p.name === "Fatima Ali") || participants[1]
      ].filter(Boolean),
      isActive: false,
      maxParticipants: 4
    },
    {
      id: "2",
      name: "Group Discussion - Verses 11-20",
      participants: [
        participants[2] || participants[0]
      ],
      isActive: false,
      maxParticipants: 4
    }
  ]);

  const [newRoomName, setNewRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [unassignedParticipants, setUnassignedParticipants] = useState<Participant[]>(
    participants.filter(p => p.role === 'student' && 
      !breakoutRooms.some(room => room.participants.some(rp => rp.id === p.id))
    )
  );

  const createRoom = () => {
    if (newRoomName.trim()) {
      const newRoom: BreakoutRoom = {
        id: Date.now().toString(),
        name: newRoomName,
        participants: [],
        isActive: false,
        maxParticipants: 4
      };

      setBreakoutRooms(prev => [...prev, newRoom]);
      setNewRoomName("");
    }
  };

  const toggleRoom = (roomId: string) => {
    setBreakoutRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, isActive: !room.isActive } : room
    ));
  };

  const assignToRoom = (participantId: string, roomId: string) => {
    const participant = unassignedParticipants.find(p => p.id === participantId);
    if (!participant) return;

    setBreakoutRooms(prev => prev.map(room => 
      room.id === roomId && room.participants.length < room.maxParticipants
        ? { ...room, participants: [...room.participants, participant] }
        : room
    ));

    setUnassignedParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  const removeFromRoom = (participantId: string, roomId: string) => {
    const room = breakoutRooms.find(r => r.id === roomId);
    const participant = room?.participants.find(p => p.id === participantId);
    
    if (!participant) return;

    setBreakoutRooms(prev => prev.map(r => 
      r.id === roomId 
        ? { ...r, participants: r.participants.filter(p => p.id !== participantId) }
        : r
    ));

    if (participant.role === 'student') {
      setUnassignedParticipants(prev => [...prev, participant]);
    }
  };

  const joinRoom = (roomId: string) => {
    // In a real app, this would move the user to the breakout room
    console.log(`Joining breakout room ${roomId}`);
  };

  const startAllRooms = () => {
    setBreakoutRooms(prev => prev.map(room => ({ ...room, isActive: true })));
  };

  const stopAllRooms = () => {
    setBreakoutRooms(prev => prev.map(room => ({ ...room, isActive: false })));
  };

  const autoAssign = () => {
    const roomsWithSpace = breakoutRooms.filter(room => 
      room.participants.length < room.maxParticipants
    );
    
    let currentRoomIndex = 0;
    const updatedRooms = [...breakoutRooms];
    const remainingParticipants = [...unassignedParticipants];

    remainingParticipants.forEach(participant => {
      if (currentRoomIndex < roomsWithSpace.length) {
        const room = updatedRooms.find(r => r.id === roomsWithSpace[currentRoomIndex].id);
        if (room && room.participants.length < room.maxParticipants) {
          room.participants.push(participant);
        }
        currentRoomIndex = (currentRoomIndex + 1) % roomsWithSpace.length;
      }
    });

    setBreakoutRooms(updatedRooms);
    setUnassignedParticipants([]);
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Breakout Rooms
          </div>
          <Badge variant="outline">
            {breakoutRooms.length} rooms
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Controls (Instructor Only) */}
        {isInstructor && (
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Room name..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                  <Button onClick={createRoom} disabled={!newRoomName.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" onClick={startAllRooms}>
                    <Play className="w-4 h-4 mr-1" />
                    Start All
                  </Button>
                  <Button size="sm" variant="outline" onClick={stopAllRooms}>
                    <Square className="w-4 h-4 mr-1" />
                    Stop All
                  </Button>
                  <Button size="sm" variant="outline" onClick={autoAssign}>
                    Auto Assign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unassigned Participants */}
        {isInstructor && unassignedParticipants.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <h4 className="font-medium mb-2">Unassigned Participants</h4>
              <div className="flex flex-wrap gap-2">
                {unassignedParticipants.map(participant => (
                  <Badge key={participant.id} variant="outline">
                    {participant.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Breakout Rooms List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {breakoutRooms.map((room) => (
            <Card 
              key={room.id} 
              className={room.isActive ? "border-green-500 bg-green-50" : "border-gray-200"}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm text-gray-500">
                      {room.participants.length}/{room.maxParticipants} participants
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {room.isActive && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                    {isInstructor ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRoom(room.id)}
                      >
                        {room.isActive ? (
                          <Square className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    ) : (
                      room.isActive && room.participants.some(p => p.name === participants[3]?.name) && (
                        <Button size="sm" onClick={() => joinRoom(room.id)}>
                          Join Room
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {/* Participants in Room */}
                <div className="space-y-2">
                  {room.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{participant.name}</span>
                      </div>
                      
                      {isInstructor && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromRoom(participant.id, room.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {room.participants.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No participants assigned
                    </p>
                  )}
                </div>

                {/* Assign Participants (Instructor Only) */}
                {isInstructor && unassignedParticipants.length > 0 && room.participants.length < room.maxParticipants && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-1">
                      {unassignedParticipants.slice(0, room.maxParticipants - room.participants.length).map(participant => (
                        <Button
                          key={participant.id}
                          size="sm"
                          variant="outline"
                          onClick={() => assignToRoom(participant.id, room.id)}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          {participant.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakoutRooms;
