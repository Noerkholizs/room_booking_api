import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "@/config/db";
import { AuthResponseDTO, LoginRequest, RegisterDto } from "@/types/auth.dto";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env";
import { AppError, ValidationError } from "@/errors";


export const authService = {
    register: async ({ name, email, password, role } : RegisterDto) => {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ValidationError("Email already registered");
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


    login: async ({ email, password } : LoginRequest): Promise<AuthResponseDTO> => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new ValidationError("Invalid email");
            }
    
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new ValidationError("Invalid password");
            }
    
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
    
            return {
                token,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Failed to login in service:', error);
            throw new AppError('Failed to login');
            
        }
    }
}