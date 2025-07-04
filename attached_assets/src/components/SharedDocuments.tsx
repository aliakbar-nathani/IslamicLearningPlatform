
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Upload, Download, Edit, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'document' | 'resource';
  author: string;
  lastModified: string;
  size: string;
}

interface SharedDocumentsProps {
  groupId: string;
}

const SharedDocuments = ({ groupId }: SharedDocumentsProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "Tafsir Notes - Verse 1-10",
      content: "Detailed notes on the first 10 verses of Surah Al-Baqarah...",
      type: "note",
      author: "Ahmed Hassan",
      lastModified: "2024-01-15",
      size: "2.3 KB"
    },
    {
      id: "2",
      title: "Arabic Grammar Reference",
      content: "Comprehensive guide to Arabic grammar rules...",
      type: "resource",
      author: "Fatima Ali",
      lastModified: "2024-01-12",
      size: "15.7 KB"
    },
    {
      id: "3",
      title: "Study Schedule Template",
      content: "Weekly study schedule for consistent learning...",
      type: "document",
      author: "Omar Khan",
      lastModified: "2024-01-10",
      size: "1.2 KB"
    }
  ]);

  const [newDocument, setNewDocument] = useState({
    title: "",
    content: "",
    type: "note" as Document['type']
  });

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateDocument = () => {
    if (!newDocument.title || !newDocument.content) return;

    const document: Document = {
      id: Date.now().toString(),
      title: newDocument.title,
      content: newDocument.content,
      type: newDocument.type,
      author: "Current User",
      lastModified: new Date().toISOString().split('T')[0],
      size: `${(newDocument.content.length / 1024).toFixed(1)} KB`
    };

    setDocuments(prev => [...prev, document]);
    setNewDocument({ title: "", content: "", type: "note" });
    
    toast({
      title: "Document Created",
      description: "Your document has been added to the shared repository."
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the repository."
    });
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading ${document.title}...`
    });
  };

  const getTypeIcon = (type: Document['type']) => {
    return <FileText className="w-4 h-4" />;
  };

  const getTypeBadgeColor = (type: Document['type']) => {
    switch (type) {
      case 'note': return 'default';
      case 'document': return 'secondary';
      case 'resource': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Shared Documents & Notes
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Document title"
                        value={newDocument.title}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newDocument.type}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value as Document['type'] }))}
                      >
                        <option value="note">Note</option>
                        <option value="document">Document</option>
                        <option value="resource">Resource</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Document content..."
                      rows={10}
                      value={newDocument.content}
                      onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleCreateDocument} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Create Document
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3 flex-1">
                  {getTypeIcon(document.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{document.title}</h4>
                      <Badge variant={getTypeBadgeColor(document.type)}>
                        {document.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {document.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      By {document.author} • {document.lastModified} • {document.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{document.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>By {document.author}</span>
                          <span>•</span>
                          <span>{document.lastModified}</span>
                          <Badge variant={getTypeBadgeColor(document.type)}>
                            {document.type}
                          </Badge>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{document.content}</pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedDocuments;
