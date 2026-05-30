import { Router } from 'express';
import { register, login, refreshToken, getMe, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               mobile: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
