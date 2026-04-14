import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { login, isLoginLoading, loginError, isAuthenticated, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect to profile page when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.profile_slug) {
      setLocation(`/member/${user.profile_slug}`);
    }
  }, [isAuthenticated, user?.profile_slug, setLocation]);

  // Redirect if already authenticated
  if (isAuthenticated && user?.profile_slug) {
    return null;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // User will be fetched by useAuth hook, useEffect will handle redirect
    } catch (error) {
      // Error handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-display font-bold text-center break-words">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Sign in to your CEDAT member account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                className={`min-h-[44px] ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`min-h-[44px] pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {loginError.message || 'Login failed. Please check your credentials.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full min-h-[44px]"
              disabled={isLoginLoading}
              size="lg"
            >
              {isLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent hover:underline">
                Become a CEDAT Member
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
