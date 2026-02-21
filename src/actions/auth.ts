"use server";

import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateResetToken,
  calculateResetTokenExpiry,
  generateVerificationToken,
  calculateVerificationTokenExpiry,
  isTokenExpired,
} from "@/lib/auth-utils";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "@/lib/validations";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/email-auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = calculateVerificationTokenExpiry();

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // In a real implementation, you would store the verification token
    // and send the verification email here
    // await sendVerificationEmail({
    //   to: user.email,
    //   name: user.name || user.email,
    //   token: verificationToken,
    // });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed to register user",
    };
  }
}

export async function verifyEmail(token: string) {
  try {
    // In a real implementation, you would have a VerificationToken model
    // For now, we'll skip this and just return success
    return {
      success: true,
    };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "Failed to verify email",
    };
  }
}

export async function forgotPassword(data: z.infer<typeof forgotPasswordSchema>) {
  try {
    const validatedData = forgotPasswordSchema.parse(data);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      return {
        success: true,
        message: "If an account exists, a reset email has been sent",
      };
    }

    // Check if user has a password (OAuth users can't reset password)
    if (!user.password) {
      return {
        success: true,
        message: "If an account exists, a reset email has been sent",
      };
    }

    // Delete any existing reset tokens
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = calculateResetTokenExpiry();

    // Store reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expires: resetExpires,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name || user.email,
      token: resetToken,
    });

    return {
      success: true,
      message: "If an account exists, a reset email has been sent",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: true,
      message: "If an account exists, a reset email has been sent",
    };
  }
}

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
  try {
    const validatedData = resetPasswordSchema.parse(data);

    // Find valid reset token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token: validatedData.token },
      include: { user: true },
    });

    if (!passwordReset) {
      return {
        success: false,
        error: "Invalid or expired reset token",
      };
    }

    // Check if token is expired
    if (isTokenExpired(passwordReset.expires)) {
      // Delete expired token
      await prisma.passwordReset.delete({
        where: { id: passwordReset.id },
      });

      return {
        success: false,
        error: "Invalid or expired reset token",
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.password);

    // Update user password
    await prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });

    // Delete used reset token
    await prisma.passwordReset.delete({
      where: { id: passwordReset.id },
    });

    return {
      success: true,
      message: "Password has been reset successfully",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "Failed to reset password",
    };
  }
}

export async function changePassword(
  userId: string,
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const validatedData = changePasswordSchema.parse(data);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "User not found or password not set",
      };
    }

    // Verify current password
    const isCorrectPassword = await verifyPassword(
      validatedData.currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Password has been changed successfully",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: "Failed to change password",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  data: z.infer<typeof updateProfileSchema>
) {
  try {
    const validatedData = updateProfileSchema.parse(data);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.image && { image: validatedData.image }),
      },
    });

    revalidatePath("/[locale]/dashboard");

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
