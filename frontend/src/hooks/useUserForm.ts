import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormValues } from '@/schemas';

export function useUserForm() {
  return useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: undefined,
      confirm_password: undefined,
    },
  });
}
