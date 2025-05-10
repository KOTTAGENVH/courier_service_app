// controllers/authController.ts

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { customEmail } from "../nodemailer/customEmail.js";


//Object of PrismaClient
const prisma = new PrismaClient();
//Salt rounds for greater security
const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;

//Generate access and refresh tokens
const generateAccessToken = (userId: number) =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });

const generateRefreshToken = (userId: number) =>
    jwt.sign({ userId }, process.env.REFRESH_TOKEN!, { expiresIn: "7d" });


// Register a new user
export const register: RequestHandler = async (req, res) => {
    try {
        const { firstName, lastName, email, address, telephone, password } = req.body;

        // check required fields
        if (!firstName || !lastName || !email || !address || !telephone || !password) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }
        // check existing
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ error: "Email already in use." });
            return;
        }

        // hash & salt
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);

        // create
        const user = await prisma.user.create({
            data: { firstName, lastName, email, address, telephone, password: hashed },
        });

        // tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        //set access token as httpOnly cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // set refresh as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json("Account created successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//User login
export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check existing
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        };
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // set access token as httpOnly cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // set refresh as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json("Login successful.");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//Forgot password
export const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(200).json({ message: "If your email is in our system, you’ll receive a reset link." });
            return;
        }

        // create reset token
        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_RESET_PASSWORD_SECRET!,
            { expiresIn: "1h" }
        );
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // send email
        customEmail({
            email,
            subject: "Password Reset Request",
            body: `
        <p>You requested a password reset. Click the link below to choose a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
        });

        res.json({ message: "If that email is in our system, you’ll receive a reset link." });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
        return;
    }
};

//Get user profile
export const getUserProfile: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                address: true,
                telephone: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        res.json(user);
        return;
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ error: "Server error." });
        return;
    }
};

// Logout user 
export const logout: RequestHandler = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.json({ message: "Logout successful." });
        return;
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ error: "Server error." });
        return;
    }
};

//Admin user registration
export async function seedAdmin(): Promise<void> {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set; skipping admin seed.');
        return;
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log(`Admin user already exists: ${email}`);
            return;
        }

        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        await prisma.user.create({
            data: {
                firstName: 'Admin',
                lastName: 'User',
                email,
                password: hashed,
                address: '',
                telephone: '',
            },
        });
        console.log(`Seeded admin user: ${email}`);
    } catch (err) {
        console.error('Error seeding admin user:', err);
    }
}
