import React, { useState, useEffect } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { Camera } from './components/Camera';
import { ImageUpload } from './components/ImageUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FaceAnalyzer } from './utils/faceAnalyzer';

function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    // Initialize face analyzer when component mounts
    const analyzer = FaceAnalyzer.getInstance();
    analyzer.initialize();
  }, []);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        const img = new Image();
        img.onload = () => processImage(img);
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (imageData: string) => {
    setSelectedImage(imageData);
    setShowCamera(false);
    const img = new Image();
    img.onload = () => processImage(img);
    img.src = imageData;
  };

  const processImage = async (image: HTMLImageElement) => {
    setIsProcessing(true);
    try {
      const analyzer = FaceAnalyzer.getInstance();
      const results = await analyzer.analyzeFace(image);
      setFaces(results);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Face Detection & Mood Analysis
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          {!selectedImage ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Upload Image</h2>
                  <ImageUpload onImageSelect={handleImageSelect} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Use Camera</h2>
                  <button
                    onClick={() => setShowCamera(true)}
                    className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg 
                      flex flex-col items-center justify-center space-y-2 hover:border-blue-500 
                      transition-colors"
                  >
                    <CameraIcon className="h-12 w-12 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to open camera
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Analysis Results</h2>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setFaces([]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Analyze Another Image
                </button>
              </div>
              <ResultsDisplay
                imageUrl={selectedImage}
                faces={faces}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>
      </main>

      {showCamera && (
        <Camera
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default App;