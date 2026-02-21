import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function calculateResetTokenExpiry(): Date {
  return addHours(new Date(), 1); // Token expires in 1 hour
}

export function calculateVerificationTokenExpiry(): Date {
  return addHours(new Date(), 24); // Token expires in 24 hours
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
