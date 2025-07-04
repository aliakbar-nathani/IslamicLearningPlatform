
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Send, Check, X } from "lucide-react";

interface Question {
  id: string;
  question: string;
  askedBy: string;
  timestamp: string;
  upvotes: number;
  isAnswered: boolean;
  answer?: string;
  answeredBy?: string;
}

interface LiveQAProps {
  classId: string;
  isInstructor: boolean;
  studentName: string;
}

const LiveQA = ({ classId, isInstructor, studentName }: LiveQAProps) => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "Can you explain the difference between 'Tafsir' and 'Ta'wil'?",
      askedBy: "Ahmad Hassan",
      timestamp: "2 minutes ago",
      upvotes: 3,
      isAnswered: false
    },
    {
      id: "2",
      question: "What is the historical context of verse 2:30?",
      askedBy: "Fatima Ali",
      timestamp: "5 minutes ago",
      upvotes: 1,
      isAnswered: true,
      answer: "This verse refers to Allah informing the angels about creating Adam as khalifa on earth...",
      answeredBy: "Sheikh Ali Al-Husseini"
    },
    {
      id: "3",
      question: "How should we understand the concept of 'Fitrah' mentioned in the Quran?",
      askedBy: "Hussein Mohammad",
      timestamp: "8 minutes ago",
      upvotes: 5,
      isAnswered: false
    }
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      const question: Question = {
        id: Date.now().toString(),
        question: newQuestion,
        askedBy: studentName,
        timestamp: "Just now",
        upvotes: 0,
        isAnswered: false
      };
      
      setQuestions(prev => [question, ...prev]);
      setNewQuestion("");
    }
  };

  const handleUpvote = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    ));
  };

  const handleAnswerQuestion = (questionId: string) => {
    const answer = answerText[questionId];
    if (answer?.trim()) {
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              isAnswered: true, 
              answer: answer,
              answeredBy: "Sheikh Ali Al-Husseini"
            } 
          : q
      ));
      setAnswerText(prev => ({ ...prev, [questionId]: "" }));
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isAnswered !== b.isAnswered) {
      return a.isAnswered ? 1 : -1;
    }
    return b.upvotes - a.upvotes;
  });

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Live Q&A
          </div>
          <Badge variant="outline">
            {questions.length} questions
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Ask Question */}
        {!isInstructor && (
          <div className="flex space-x-2">
            <Input
              placeholder="Ask a question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
            />
            <Button onClick={handleSubmitQuestion} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {sortedQuestions.map((question) => (
            <Card key={question.id} className={question.isAnswered ? "bg-green-50" : "bg-white"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{question.question}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        by {question.askedBy} • {question.timestamp}
                      </span>
                      {question.isAnswered && (
                        <Badge className="bg-green-100 text-green-800">
                          Answered
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpvote(question.id)}
                      className="flex items-center space-x-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{question.upvotes}</span>
                    </Button>
                  </div>
                </div>

                {question.isAnswered && question.answer && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Check className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-800">
                        Answer by {question.answeredBy}:
                      </span>
                    </div>
                    <p className="text-gray-700">{question.answer}</p>
                  </div>
                )}

                {isInstructor && !question.isAnswered && (
                  <div className="mt-3 space-y-2">
                    <Input
                      placeholder="Type your answer..."
                      value={answerText[question.id] || ""}
                      onChange={(e) => setAnswerText(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAnswerQuestion(question.id)}
                        disabled={!answerText[question.id]?.trim()}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Answer
                      </Button>
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

export default LiveQA;
