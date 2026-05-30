import { Router } from 'express';
import User from '../models/User.model';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);

router.get('/profile', async (req: any, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', async (req: any, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name, avatar: req.body.avatar }, { new: true });
  res.json({ success: true, data: user });
});

router.post('/address', async (req: any, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    (user.addresses as any[]).push(req.body);
    await user.save();
    res.json({ success: true, data: user.addresses });
  }
});

export default router;
