
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudyGroupCard from "./StudyGroupCard";
import StudyGroupDetails from "./StudyGroupDetails";
import CreateGroupForm from "./CreateGroupForm";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  courseId: string;
  courseName: string;
  nextMeeting?: string;
  meetingLink?: string;
  isJoined: boolean;
  isUserAdmin: boolean;
  privacy: 'public' | 'private';
}

const StudyGroups = () => {
  const { toast } = useToast();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "Tafsir Discussion Circle",
      description: "Weekly discussions on Quranic interpretation and understanding",
      memberCount: 8,
      maxMembers: 12,
      courseId: "1",
      courseName: "Complete Tafsir of Surah Al-Baqarah",
      nextMeeting: "2024-01-20 19:00",
      meetingLink: "https://meet.google.com/abc-def-ghi",
      isJoined: true,
      isUserAdmin: true,
      privacy: 'public'
    },
    {
      id: "2",
      name: "Arabic Grammar Study Group",
      description: "Practice Arabic grammar concepts together",
      memberCount: 5,
      maxMembers: 10,
      courseId: "1",
      courseName: "Complete Tafsir of Surah Al-Baqarah",
      nextMeeting: "2024-01-18 20:00",
      isJoined: false,
      isUserAdmin: false,
      privacy: 'public'
    },
    {
      id: "3",
      name: "Hadith Study Circle",
      description: "Explore hadith related to Quranic verses",
      memberCount: 12,
      maxMembers: 15,
      courseId: "1",
      courseName: "Complete Tafsir of Surah Al-Baqarah",
      isJoined: false,
      isUserAdmin: false,
      privacy: 'private'
    }
  ]);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const selectedGroup = studyGroups.find(group => group.id === selectedGroupId);

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: true, memberCount: group.memberCount + 1 }
        : group
    ));
    
    toast({
      title: "Joined Study Group",
      description: "You've successfully joined the study group!"
    });
  };

  const handleLeaveGroup = (groupId: string) => {
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isJoined: false, memberCount: group.memberCount - 1 }
        : group
    ));
    
    toast({
      title: "Left Study Group",
      description: "You've left the study group."
    });
  };

  const handleCreateGroup = (name: string) => {
    const newGroup: StudyGroup = {
      id: Date.now().toString(),
      name,
      description: "New study group for collaborative learning",
      memberCount: 1,
      maxMembers: 10,
      courseId: "1",
      courseName: "Complete Tafsir of Surah Al-Baqarah",
      isJoined: true,
      isUserAdmin: true,
      privacy: 'public'
    };

    setStudyGroups(prev => [...prev, newGroup]);
    
    toast({
      title: "Study Group Created",
      description: "Your new study group has been created!"
    });
  };

  const handleJoinMeeting = (meetingLink?: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      toast({
        title: "No Meeting Link",
        description: "No meeting link available for this group."
      });
    }
  };

  if (selectedGroup) {
    return (
      <StudyGroupDetails 
        group={selectedGroup}
        onBack={() => setSelectedGroupId(null)}
        onJoinMeeting={handleJoinMeeting}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Study Groups
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <CreateGroupForm onCreateGroup={handleCreateGroup} />

          <div className="space-y-4">
            {studyGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onJoinGroup={handleJoinGroup}
                onLeaveGroup={handleLeaveGroup}
                onOpenGroup={setSelectedGroupId}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGroups;
