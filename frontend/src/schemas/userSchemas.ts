import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => val === '' || val.length >= 8,
      'Password must be at least 8 characters (or leave empty to keep current)'
    )
    .optional(),
  confirm_password: z.string()
    .transform(val => val?.trim() || '')
    .optional(),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.confirm_password === data.password;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type UserFormValues = z.infer<typeof userSchema>;
