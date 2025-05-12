import express from 'express';
import { authMiddleware } from '../middleware/tokenAuthenticate.js';
import { getAllNotificationsAdmin, getUserUnreadNotifications, markNotificationAsViewed } from '../controller/notificationController.js';

const notificationRouter = express.Router();

// Admin routes
notificationRouter.post('/admin/allnotifications', authMiddleware, getAllNotificationsAdmin);

// User routes
notificationRouter.post('/users/allnotifications', authMiddleware, getUserUnreadNotifications);
notificationRouter.patch('/users/readnotifications/:id', authMiddleware, markNotificationAsViewed);

export default notificationRouter;