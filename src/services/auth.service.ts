import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/config/db";
import { LoginDto, RegisterDto } from "@/types/auth.dto";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env";


export const authService = {
    register: async ({ name, email, password, role } : RegisterDto) => {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already registered");
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    },



    login: async ({ email, password } : LoginDto) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: Number(JWT_EXPIRES_IN) }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}