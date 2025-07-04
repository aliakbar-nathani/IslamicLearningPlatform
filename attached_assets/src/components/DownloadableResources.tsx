
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Video } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'video' | 'document';
  size: string;
  downloadUrl: string;
}

interface DownloadableResourcesProps {
  resources: Resource[];
}

const DownloadableResources = ({ resources }: DownloadableResourcesProps) => {
  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleDownload = (resource: Resource) => {
    // Simulate download
    console.log(`Downloading ${resource.title}`);
    // In a real app, this would trigger the actual download
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6">Downloadable Resources</h3>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                {getIcon(resource.type)}
                <div>
                  <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.size}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(resource)}
                className="hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadableResources;
