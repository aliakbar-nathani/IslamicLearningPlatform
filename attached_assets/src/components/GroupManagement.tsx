
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Settings, UserPlus, Shield, Lock, Globe, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GroupMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending';
  joinedDate: string;
}

interface GroupSettings {
  privacy: 'public' | 'private';
  requireApproval: boolean;
  allowMembersToInvite: boolean;
}

interface GroupManagementProps {
  groupId: string;
  isUserAdmin: boolean;
}

const GroupManagement = ({ groupId, isUserAdmin }: GroupManagementProps) => {
  const { toast } = useToast();
  const [members, setMembers] = useState<GroupMember[]>([
    {
      id: "1",
      name: "Ahmed Hassan",
      role: "admin",
      status: "active",
      joinedDate: "2024-01-01"
    },
    {
      id: "2",
      name: "Fatima Ali",
      role: "moderator",
      status: "active",
      joinedDate: "2024-01-05"
    },
    {
      id: "3",
      name: "Omar Khan",
      role: "member",
      status: "pending",
      joinedDate: "2024-01-15"
    }
  ]);

  const [settings, setSettings] = useState<GroupSettings>({
    privacy: 'public',
    requireApproval: true,
    allowMembersToInvite: false
  });

  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const handleApproveUser = (userId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === userId ? { ...member, status: 'active' as const } : member
    ));
    toast({
      title: "Member Approved",
      description: "User has been approved to join the group."
    });
  };

  const handleChangeRole = (userId: string, newRole: 'admin' | 'moderator' | 'member') => {
    setMembers(prev => prev.map(member => 
      member.id === userId ? { ...member, role: newRole } : member
    ));
    toast({
      title: "Role Updated",
      description: `User role has been changed to ${newRole}.`
    });
  };

  const handleScheduleMeeting = () => {
    if (!meetingLink || !meetingTime) return;
    
    toast({
      title: "Meeting Scheduled",
      description: `Meeting scheduled for ${meetingTime} with link: ${meetingLink}`
    });
    setMeetingLink("");
    setMeetingTime("");
  };

  if (!isUserAdmin) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-gray-600">You don't have permission to manage this group.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Group Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Privacy</label>
              <Select 
                value={settings.privacy} 
                onValueChange={(value: 'public' | 'private') => 
                  setSettings(prev => ({ ...prev, privacy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireApproval"
                checked={settings.requireApproval}
                onChange={(e) => setSettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
              />
              <label htmlFor="requireApproval" className="text-sm">Require approval for new members</label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Meeting Link</label>
              <Input
                placeholder="Google Meet/Zoom link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <Input
                type="datetime-local"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleScheduleMeeting} className="bg-emerald-600 hover:bg-emerald-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Member Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.role === 'admin' ? 'default' : 'outline'}>
                        {member.role}
                      </Badge>
                      <Badge variant={member.status === 'active' ? 'outline' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {member.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveUser(member.id)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Approve
                    </Button>
                  )}
                  {member.role !== 'admin' && (
                    <Select 
                      value={member.role} 
                      onValueChange={(value: 'admin' | 'moderator' | 'member') => 
                        handleChangeRole(member.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupManagement;
