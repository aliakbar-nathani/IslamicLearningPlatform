
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Plus, Play, Square, Users } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  totalVotes: number;
  createdBy: string;
}

interface LivePollsProps {
  classId: string;
  isInstructor: boolean;
  studentName: string;
}

const LivePolls = ({ classId, isInstructor, studentName }: LivePollsProps) => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      question: "What is the main theme of Surah Al-Baqarah?",
      options: [
        { id: "1", text: "Guidance for believers", votes: 12 },
        { id: "2", text: "Stories of previous nations", votes: 8 },
        { id: "3", text: "Laws and regulations", votes: 5 },
        { id: "4", text: "All of the above", votes: 15 }
      ],
      isActive: false,
      totalVotes: 40,
      createdBy: "Sheikh Ali Al-Husseini"
    }
  ]);

  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""]
  });

  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const createPoll = () => {
    if (newPoll.question.trim() && newPoll.options.every(opt => opt.trim())) {
      const poll: Poll = {
        id: Date.now().toString(),
        question: newPoll.question,
        options: newPoll.options.map((text, index) => ({
          id: index.toString(),
          text,
          votes: 0
        })),
        isActive: true,
        totalVotes: 0,
        createdBy: "Sheikh Ali Al-Husseini"
      };

      setPolls(prev => [poll, ...prev]);
      setNewPoll({ question: "", options: ["", ""] });
    }
  };

  const togglePoll = (pollId: string) => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, isActive: !poll.isActive } : poll
    ));
  };

  const votePoll = (pollId: string, optionId: string) => {
    if (votedPolls.has(pollId)) return;

    setPolls(prev => prev.map(poll => 
      poll.id === pollId 
        ? {
            ...poll,
            options: poll.options.map(opt => 
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
            totalVotes: poll.totalVotes + 1
          }
        : poll
    ));

    setVotedPolls(prev => new Set([...prev, pollId]));
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Live Polls
          </div>
          <Badge variant="outline">
            {polls.length} polls
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Create Poll (Instructor Only) */}
        {isInstructor && (
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Create New Poll</h3>
              
              <div className="space-y-3">
                <Input
                  placeholder="Enter your question..."
                  value={newPoll.question}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                />
                
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    {newPoll.options.length > 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={createPoll}
                    disabled={!newPoll.question.trim() || !newPoll.options.every(opt => opt.trim())}
                  >
                    Create Poll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Polls List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {polls.map((poll) => (
            <Card key={poll.id} className={poll.isActive ? "border-green-500" : "border-gray-200"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{poll.question}</h3>
                    <p className="text-sm text-gray-500">
                      by {poll.createdBy} • {poll.totalVotes} votes
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {poll.isActive && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                    {isInstructor && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePoll(poll.id)}
                      >
                        {poll.isActive ? (
                          <Square className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 
                      ? Math.round((option.votes / poll.totalVotes) * 100) 
                      : 0;
                    
                    const hasVoted = votedPolls.has(poll.id);
                    const canVote = poll.isActive && !hasVoted && !isInstructor;

                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Button
                            variant={canVote ? "outline" : "ghost"}
                            className="flex-1 justify-start text-left h-auto p-3"
                            onClick={() => canVote && votePoll(poll.id, option.id)}
                            disabled={!canVote}
                          >
                            <span className="flex-1">{option.text}</span>
                            {hasVoted && (
                              <span className="text-sm text-gray-500">
                                {option.votes} votes ({percentage}%)
                              </span>
                            )}
                          </Button>
                        </div>
                        
                        {hasVoted && (
                          <Progress value={percentage} className="h-2" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {!poll.isActive && (
                  <div className="mt-3 text-center text-sm text-gray-500">
                    This poll has ended
                  </div>
                )}

                {poll.isActive && !votedPolls.has(poll.id) && !isInstructor && (
                  <div className="mt-3 text-center text-sm text-blue-600">
                    Click an option to vote
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

export default LivePolls;
