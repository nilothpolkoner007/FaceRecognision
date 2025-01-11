import React from 'react';
import { Frown, Meh, Smile, AlertTriangle, Zap, Heart } from 'lucide-react';
import type { MoodData } from '../utils/moodTypes';

interface ResultsDisplayProps {
  imageUrl: string;
  faces: (MoodData & { bbox: { x: number; y: number; width: number; height: number } })[];
  isProcessing: boolean;
}

export function ResultsDisplay({ imageUrl, faces, isProcessing }: ResultsDisplayProps) {
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-4 h-4 text-green-500" />;
      case 'sad':
        return <Frown className="w-4 h-4 text-blue-500" />;
      case 'angry':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'surprised':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'fearful':
        return <Heart className="w-4 h-4 text-yellow-500" />;
      default:
        return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Analyzed"
          className="max-w-full rounded-lg shadow-lg"
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white">Processing...</div>
          </div>
        )}
        {faces.map((face, index) => (
          <div
            key={index}
            className="absolute border-2 border-blue-500"
            style={{
              left: `${face.bbox.x}%`,
              top: `${face.bbox.y}%`,
              width: `${face.bbox.width}%`,
              height: `${face.bbox.height}%`,
            }}
          >
            <div className="absolute -top-8 left-0 bg-white px-2 py-1 rounded shadow-md flex items-center gap-1">
              {getMoodIcon(face.emotion)}
              <span className="text-sm font-medium capitalize">{face.emotion}</span>
              <span className="text-xs text-gray-500">
                ({Math.round(face.confidence * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {faces.length > 0 && (
        <div className="space-y-4">
          {faces.map((face, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getMoodIcon(face.emotion)}
                <h3 className="font-medium">Face {index + 1}</h3>
              </div>
              <p className="text-gray-600 mb-3">{face.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Suggested Actions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {face.suggestedActions.map((action, actionIndex) => (
                    <li key={actionIndex} className="text-sm text-gray-600">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}