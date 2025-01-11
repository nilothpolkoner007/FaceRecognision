import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';  // Import WebGL backend
import * as faceDetection from '@tensorflow-models/face-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { moodTypes } from './moodTypes';

export class FaceAnalyzer {
  private static instance: FaceAnalyzer;
  private faceDetector: faceDetection.FaceDetector | null = null;
  private landmarkModel: faceLandmarksDetection.FaceLandmarksDetector | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): FaceAnalyzer {
    if (!FaceAnalyzer.instance) {
      FaceAnalyzer.instance = new FaceAnalyzer();
    }
    return FaceAnalyzer.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Set up and wait for the WebGL backend to be ready
      await tf.setBackend('webgl');
      await tf.ready();

      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
        maxFaces: 10,
      } as const;
      this.faceDetector = await faceDetection.createDetector(model, detectorConfig);

      this.landmarkModel = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
        }
      );

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing FaceAnalyzer:', error);
      throw new Error('Failed to initialize face detection models');
    }
  }

  async analyzeFace(image: HTMLImageElement | HTMLVideoElement) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.faceDetector || !this.landmarkModel) {
      throw new Error('Models not initialized');
    }

    try {
      const faces = await this.faceDetector.estimateFaces(image);
      const landmarks = await this.landmarkModel.estimateFaces(image);

      return faces.map((face, index) => {
        const landmark = landmarks[index];
        const mood = this.analyzeMood(landmark);
        
        const { width, height } = image.getBoundingClientRect();
        const bbox = {
          x: (face.box.xMin / width) * 100,
          y: (face.box.yMin / height) * 100,
          width: (face.box.width / width) * 100,
          height: (face.box.height / height) * 100
        };

        return {
          bbox,
          ...moodTypes[mood.emotion]
        };
      });
    } catch (error) {
      console.error('Error analyzing face:', error);
      throw error;
    }
  }

  private analyzeMood(landmarks: faceLandmarksDetection.Face) {
    const mouthHeight = this.calculateMouthHeight(landmarks);
    const eyeOpenness = this.calculateEyeOpenness(landmarks);
    const browAngle = this.calculateBrowAngle(landmarks);
    
    if (mouthHeight > 0.4 && eyeOpenness > 0.3) {
      return moodTypes.happy;
    } else if (eyeOpenness < 0.2 && browAngle < -0.1) {
      return moodTypes.sad;
    } else if (browAngle > 0.2 && mouthHeight < 0.2) {
      return moodTypes.angry;
    } else if (eyeOpenness > 0.4 && mouthHeight > 0.3) {
      return moodTypes.surprised;
    } else if (browAngle < -0.15 && eyeOpenness < 0.25) {
      return moodTypes.fearful;
    }
    return moodTypes.neutral;
  }

  private calculateMouthHeight(landmarks: faceLandmarksDetection.Face): number {
    const upperLip = landmarks.keypoints[13];
    const lowerLip = landmarks.keypoints[14];
    return Math.abs(upperLip.y - lowerLip.y);
  }

  private calculateEyeOpenness(landmarks: faceLandmarksDetection.Face): number {
    const leftEyeUpper = landmarks.keypoints[159];
    const leftEyeLower = landmarks.keypoints[145];
    const rightEyeUpper = landmarks.keypoints[386];
    const rightEyeLower = landmarks.keypoints[374];
    
    const leftEyeOpenness = Math.abs(leftEyeUpper.y - leftEyeLower.y);
    const rightEyeOpenness = Math.abs(rightEyeUpper.y - rightEyeLower.y);
    
    return (leftEyeOpenness + rightEyeOpenness) / 2;
  }

  private calculateBrowAngle(landmarks: faceLandmarksDetection.Face): number {
    const leftBrow = landmarks.keypoints[282];
    const rightBrow = landmarks.keypoints[52];
    return Math.atan2(rightBrow.y - leftBrow.y, rightBrow.x - leftBrow.x);
  }
}