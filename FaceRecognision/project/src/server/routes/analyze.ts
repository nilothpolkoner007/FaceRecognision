import { Router } from 'express';
import multer from 'multer';
import { FaceAnalyzer } from '../models/FaceAnalyzer';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const faceAnalyzer = new FaceAnalyzer();
faceAnalyzer.initialize();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert buffer to ImageData
    const img = await createImageData(req.file.buffer);
    const results = await faceAnalyzer.analyzeFace(img);

    res.json({ faces: results });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const results = await faceAnalyzer.analyzeFace(imageData);
    res.json({ faces: results });
  } catch (error) {
    console.error('Error analyzing frame:', error);
    res.status(500).json({ error: 'Failed to analyze frame' });
  }
});

async function createImageData(buffer: Buffer): Promise<ImageData> {
  const img = new Image();
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}