import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
type SignUpData = {
    email: string;
    password: string;
    role: "USER" | "ATLORA_ADMIN";
}

async function signUp(data: SignUpData){
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            globalRole: data.role
        }
    })
    return user;
}

async function logIn(email: string, password: string){
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) throw new Error("Email not found");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = jwt.sign({userId: user.id, email: user.email, role: user.globalRole}, JWT_SECRET, {expiresIn: "1h"});
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.session.create({
        data: { userId: user.id, token, expiresAt },
    });

    return {token, user, session};
}

export {signUp, logIn}