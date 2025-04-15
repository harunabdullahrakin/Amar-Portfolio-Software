import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function handleImageUpload(req: Request, res: Response) {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const matches = req.body.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    const fileType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const fileName = `${randomUUID()}.${fileType}`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    const imageUrl = `/uploads/${fileName}`;
    console.log('Image uploaded successfully:', imageUrl);
    return res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}

export async function getUploadedImages(req: Request, res: Response) {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ images: [] });
    }
    
    const files = fs.readdirSync(uploadsDir);
    const images = files.map(file => {
      return {
        name: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadsDir, file)).size,
        createdAt: fs.statSync(path.join(uploadsDir, file)).birthtime
      };
    });
    
    return res.status(200).json({ images });
  } catch (error) {
    console.error('Error getting images:', error);
    return res.status(500).json({ error: 'Failed to get images' });
  }
}

export async function deleteUploadedImage(req: Request, res: Response) {
  try {
    const { fileName } = req.params;
    
    if (!fileName) {
      return res.status(400).json({ error: 'No file name provided' });
    }
    
    const filePath = path.join(uploadsDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
}