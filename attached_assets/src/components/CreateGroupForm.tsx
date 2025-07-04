
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CreateGroupFormProps {
  onCreateGroup: (name: string) => void;
}

const CreateGroupForm = ({ onCreateGroup }: CreateGroupFormProps) => {
  const [newGroupName, setNewGroupName] = useState("");

  const handleSubmit = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName);
      setNewGroupName("");
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Create a new study group..."
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
        <Plus className="w-4 h-4 mr-2" />
        Create
      </Button>
    </div>
  );
};

export default CreateGroupForm;
