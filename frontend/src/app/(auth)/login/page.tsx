'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, ErrorAlert } from '@/components';
import { Button } from '@/components/ui/button';
import { loginSchema, LoginFormValues } from '@/schemas';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      login(response.data.data.user, response.data.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
      </div>
      <ErrorAlert message={error} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          registration={register('email')}
        />

        <InputField
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          showToggle
          showValue={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          registration={register('password')}
        />

        <Button type="submit" disabled={loading} className="w-full mt-2">
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-600 font-semibold hover:underline">
          Register
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
