'use server';

import { prisma } from '@/lib/db';
import { contactFormSchema, ContactFormData } from '@/lib/validations';
import { sendContactFormNotification } from '@/lib/email';
import { ContactMessage } from '@/types';

export async function submitContactForm(data: ContactFormData): Promise<ContactMessage> {
  const validatedData = contactFormSchema.parse(data);

  const message = await prisma.contactMessage.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
    },
  });

  // Send notification email
  try {
    await sendContactFormNotification({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      message: validatedData.message,
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw here - the message is already saved to the database
  }

  return message;
}

export async function sendContactMessage(data: ContactFormData): Promise<ContactMessage> {
  return submitContactForm(data);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateMessageStatus(id: string, status: string): Promise<ContactMessage> {
  return await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
}
