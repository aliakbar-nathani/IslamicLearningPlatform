
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pen, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Palette, 
  RotateCcw, 
  Download,
  Upload
} from "lucide-react";

interface InteractiveWhiteboardProps {
  classId: string;
  isInstructor: boolean;
}

const InteractiveWhiteboard = ({ classId, isInstructor }: InteractiveWhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'rectangle' | 'circle' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [canDraw, setCanDraw] = useState(isInstructor);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canDraw) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canDraw) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const requestDrawingPermission = () => {
    // In a real app, this would send a request to the instructor
    console.log("Requesting drawing permission...");
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Pen className="w-5 h-5 mr-2" />
            Interactive Whiteboard
          </CardTitle>
          {!canDraw && !isInstructor && (
            <Button size="sm" onClick={requestDrawingPermission}>
              Request Drawing Permission
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Tools */}
        <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('pen')}
              disabled={!canDraw}
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('eraser')}
              disabled={!canDraw}
            >
              <Eraser className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === 'rectangle' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('rectangle')}
              disabled={!canDraw}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === 'circle' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('circle')}
              disabled={!canDraw}
            >
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === 'text' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('text')}
              disabled={!canDraw}
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Color Palette */}
            <div className="flex items-center space-x-1">
              <Palette className="w-4 h-4 text-gray-600" />
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    currentColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  disabled={!canDraw}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-16"
                disabled={!canDraw}
              />
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={clearCanvas} disabled={!canDraw}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-80 bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {!canDraw && (
          <div className="mt-2 text-center text-sm text-gray-500">
            Drawing is currently disabled. Request permission from the instructor to draw.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveWhiteboard;
