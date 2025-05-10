// router.ts

import express from 'express';
import {
  register,
  login,
  forgotPassword,
  getUserProfile,
  logout,
} from '../controller/authController.js';
import { authMiddleware } from '../middleware/tokenAuthenticate.js';

const authRouter = express.Router();

authRouter.post('/signup', register);
authRouter.post('/login', login);
authRouter.post('/forgot-password', forgotPassword);
authRouter.get('/profile',authMiddleware, getUserProfile);
authRouter.post('/logout',authMiddleware, logout);

export default authRouter;
