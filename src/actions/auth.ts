'use server';

import { signIn, signOut } from '@/auth';
import { loginSchema } from '@/lib/validations';
import { AuthError } from 'next-auth';

export async function login(formData: FormData, locale: string = 'en') {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: 'Invalid credentials' };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: `/${locale}/admin`,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
}

export async function logout(locale: string = 'en') {
  await signOut({ redirectTo: `/${locale}` });
}
