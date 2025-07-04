
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, FileText, Video, Settings, Calendar } from "lucide-react";
import GroupManagement from "./GroupManagement";
import SharedDocuments from "./SharedDocuments";
import LiveGroupChat from "./LiveGroupChat";

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

interface StudyGroupDetailsProps {
  group: StudyGroup;
  onBack: () => void;
  onJoinMeeting: (meetingLink?: string) => void;
}

const StudyGroupDetails = ({ group, onBack, onJoinMeeting }: StudyGroupDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4"
          >
            ← Back to Groups
          </Button>
          <h2 className="text-2xl font-bold">{group.name}</h2>
          <p className="text-gray-600">{group.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {group.memberCount}/{group.maxMembers} members
          </Badge>
          <Badge variant={group.privacy === 'public' ? 'outline' : 'secondary'}>
            {group.privacy}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Video className="w-4 h-4 mr-2" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <LiveGroupChat 
            groupId={group.id} 
            currentUser="Current User"
          />
        </TabsContent>

        <TabsContent value="documents">
          <SharedDocuments groupId={group.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Scheduled Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {group.nextMeeting ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Next Study Session</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(group.nextMeeting).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => onJoinMeeting(group.meetingLink)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No scheduled meetings</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <GroupManagement 
            groupId={group.id} 
            isUserAdmin={group.isUserAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroupDetails;
