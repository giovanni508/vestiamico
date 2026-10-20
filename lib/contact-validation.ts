// Regole di validazione condivise tra modulo (browser) e API (server).
export type ContactInput = { name: string; email: string; phone?: string; message: string; consent: boolean };
export type ContactErrors = Partial<Record<'name' | 'email' | 'message' | 'consent', 'name' | 'emailEmpty' | 'emailInvalid' | 'message' | 'consent'>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (!input.name || input.name.trim().length < 2) errors.name = 'name';
  if (!input.email || !input.email.trim()) errors.email = 'emailEmpty';
  else if (!EMAIL.test(input.email.trim())) errors.email = 'emailInvalid';
  if (!input.message || input.message.trim().length < 10) errors.message = 'message';
  if (!input.consent) errors.consent = 'consent';
  return errors;
}

export const LIMITS = { name: 120, email: 200, phone: 40, message: 4000 } as const;
