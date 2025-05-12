// controllers/notificationController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllNotificationsAdmin = async (req: Request, res: Response) => {
    // @ts-expect-error injected by auth middleware
    if (req.userEmail !== process.env.ADMIN_EMAIL) {
        res.status(403).json({ error: 'Only admin may access all notifications' });
        return;
    }

    try {
        const notifications = await prisma.notification.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                viewed: true,
                user: {
                    select: { id: true, email: true, firstName: true, lastName: true }
                },
                shipment: {
                    select: { id: true, shippingId: true, status: true }
                }
            }
        });

        res.json({ notifications });
    } catch (error) {
        console.error('getAllNotificationsAdmin error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications', details: error });
    }
};

export const getUserUnreadNotifications = async (req: Request, res: Response) => {
    // @ts-expect-error injected by auth middleware
    const email: string | undefined = req.userEmail;
    if (!email) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const unread = await prisma.notification.findMany({
            where: { userId: user.id, viewed: false },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                shipment: {
                    select: { shippingId: true, status: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json({ unread });
    } catch (error) {
        console.error('getUserUnreadNotifications error:', error);
        res.status(500).json({ error: 'Failed to fetch unread notifications', details: error });
    }
};

export const markNotificationAsViewed = async (req: Request, res: Response) => {
    const rawId = req.params.id;
    const id = Number(rawId);
    if (Number.isNaN(id) || id <= 0) {
        res.status(400).json({ error: 'Invalid notification ID' });
        return;
    }

    // @ts-expect-error injected by auth middleware
    const email: string | undefined = req.userEmail;
    if (!email) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const notification = await prisma.notification.findUnique({
            where: { id },
            select: { id: true, userId: true, viewed: true }
        });
        if (!notification || notification.userId !== user.id) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }
        if (notification.viewed) {
            res.status(400).json({ error: 'Notification already viewed' });
            return;
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { viewed: true }
        });

        res.json(updated);
    } catch (error) {
        console.error('markNotificationAsViewed error:', error);
        res.status(500).json({ error: 'Failed to update notification', details: error });
    }
};
