
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageCircle } from "lucide-react";

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

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onOpenGroup: (groupId: string) => void;
}

const StudyGroupCard = ({ group, onJoinGroup, onLeaveGroup, onOpenGroup }: StudyGroupCardProps) => {
  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              {group.isJoined && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                  Joined
                </Badge>
              )}
              <Badge variant={group.privacy === 'public' ? 'outline' : 'secondary'}>
                {group.privacy}
              </Badge>
            </div>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {group.memberCount}/{group.maxMembers} members
              </div>
              {group.nextMeeting && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Next: {new Date(group.nextMeeting).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {group.isJoined ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onOpenGroup(group.id)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Open
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onLeaveGroup(group.id)}
                >
                  Leave
                </Button>
              </>
            ) : (
              <Button 
                size="sm"
                onClick={() => onJoinGroup(group.id)}
                disabled={group.memberCount >= group.maxMembers}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Join Group
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyGroupCard;
