'use client';

import { useState } from 'react';
import { authApi } from '@/services/api';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { InputField, ErrorAlert } from '@/components';
import { Button } from '@/components/ui/button';
import { registerSchema, RegisterFormValues } from '@/schemas';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    setLoading(true);

    try {
      const registerRes = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      const loginRes = await authApi.login({
        email: data.email,
        password: data.password,
      });

      login(loginRes.data.data.user, loginRes.data.data.access_token);
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Register</h1>
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField label="Name" autoComplete="name" error={errors.name?.message} registration={register('name')} />

        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />

        <InputField
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          showToggle
          showValue={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          registration={register('password')}
        />

        <InputField
          label="Confirm Password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          showToggle
          showValue={showConfirmPassword}
          onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          registration={register('confirmPassword')}
        />

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-600 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
