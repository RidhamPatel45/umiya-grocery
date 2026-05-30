import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect, authorize } from '../middleware/auth.middleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.use(protect, authorize('admin'));

router.post('/image', upload.single('image'), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, { folder: 'umiya-grocery' });
  res.json({ success: true, url: result.secure_url, public_id: result.public_id });
});

export default router;
