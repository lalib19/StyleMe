import { hash, compare } from "bcryptjs";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/authOptions';

export const auth = () => getServerSession(authOptions);

export async function hashPassword(password: string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}
