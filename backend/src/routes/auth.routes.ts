import { Router } from 'express';
import { login, me, register, updatePassword, updateProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me)
router.patch('/me', authMiddleware, updateProfile)
router.patch('/change-password', authMiddleware, updatePassword);

export default router;
