import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        if (!accessToken) {
            res.status(401).json({ error: 'Access token missing' });
            return;
        }

        try {
            // Verify current access token
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                if (!refreshToken) {
                    res.status(401).json({ error: 'Refresh token missing' });
                    return;
                }
                try {
                    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN!) as JwtPayload;
                    const newAccessToken = jwt.sign(
                        { userId: refreshDecoded.userId },
                        process.env.JWT_SECRET!,
                        { expiresIn: '15m' }
                    );
                    // Set new access token cookie
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000,
                    });
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    req.userId = refreshDecoded.userId;
                    next();
                } catch {
                    res.status(403).json({ error: 'Invalid refresh token' });
                }
            }
            res.status(403).json({ error: 'Invalid access token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
