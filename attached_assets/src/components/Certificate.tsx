
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  onDownload: () => void;
}

const Certificate = ({ studentName, courseName, completionDate, instructorName, onDownload }: CertificateProps) => {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center border-4 border-emerald-600 p-8 bg-gradient-to-br from-emerald-50 to-blue-50">
          <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Certificate of Completion</h1>
          <p className="text-gray-600 mb-6">This certifies that</p>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-emerald-600 pb-2 inline-block">
            {studentName}
          </h2>
          
          <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
          
          <h3 className="text-2xl font-semibold text-emerald-700 mb-6">
            {courseName}
          </h3>
          
          <div className="flex justify-between items-end mt-8">
            <div className="text-left">
              <p className="text-sm text-gray-600">Date of Completion</p>
              <p className="font-semibold">{completionDate}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-semibold">{instructorName}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              Islamic Learning Platform • Certificate ID: CERT-{Date.now()}
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button onClick={onDownload} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificate;
