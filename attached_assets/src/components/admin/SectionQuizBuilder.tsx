
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Quiz, QuizQuestion } from "./CourseCreationWizard";

interface SectionQuizBuilderProps {
  sectionId: string;
  quiz?: Quiz;
  onQuizUpdate: (quiz: Quiz) => void;
}

const SectionQuizBuilder = ({ sectionId, quiz, onQuizUpdate }: SectionQuizBuilderProps) => {
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  
  const [quizData, setQuizData] = useState<Quiz>(quiz || {
    id: '',
    title: '',
    questions: [],
    passingScore: 70
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const handleSaveQuiz = () => {
    const updatedQuiz = {
      ...quizData,
      id: quizData.id || `quiz-${sectionId}-${Date.now()}`
    };
    onQuizUpdate(updatedQuiz);
    setIsQuizDialogOpen(false);
  };

  const handleAddQuestion = () => {
    const question: QuizQuestion = {
      id: Date.now().toString(),
      question: newQuestion.question,
      options: newQuestion.options.filter(opt => opt.trim()),
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation
    };

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, question]
    });

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setIsQuestionDialogOpen(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter(q => q.id !== questionId)
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {quiz ? 'Edit Quiz' : 'Add Quiz'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            {quiz ? 'Edit Section Quiz' : 'Create Section Quiz'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quizTitle">Quiz Title</Label>
              <Input
                id="quizTitle"
                value={quizData.title}
                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={quizData.passingScore}
                onChange={(e) => setQuizData({...quizData, passingScore: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Questions ({quizData.questions.length})</h4>
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                        placeholder="Enter your question"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={newQuestion.correctAnswer === index}
                              onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                              className="w-4 h-4"
                            />
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Select the correct answer by clicking the radio button</p>
                    </div>

                    <div>
                      <Label htmlFor="explanation">Explanation (Optional)</Label>
                      <Textarea
                        id="explanation"
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                        placeholder="Explain why this is the correct answer"
                        rows={2}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={handleAddQuestion} disabled={!newQuestion.question || newQuestion.options.filter(opt => opt.trim()).length < 2}>
                        Add Question
                      </Button>
                      <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {quizData.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <h5 className="font-medium">{question.question}</h5>
                        </div>
                        <div className="text-sm text-gray-600 ml-6">
                          <p>Options: {question.options.length}</p>
                          <p>Correct: {question.options[question.correctAnswer]}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {quizData.questions.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-xs text-gray-400">Add questions to create your quiz</p>
              </Card>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuiz}
              disabled={!quizData.title || quizData.questions.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Save Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SectionQuizBuilder;
