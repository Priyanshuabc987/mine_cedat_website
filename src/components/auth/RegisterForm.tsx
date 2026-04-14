import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  community_role: z.string().min(1, 'Please select who you are'),
  linkedin_url: z.string().url('Please enter a valid LinkedIn URL').refine(
    (url) => url.includes('linkedin.com'),
    'Please enter a valid LinkedIn URL'
  ),
  about_yourself: z.string()
    .min(1, 'Please write about yourself')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= 100 && wordCount <= 300;
    }, 'Please write between 100 to 300 words'),
  building_description: z.string()
    .min(1, 'Please share about your startup, project or services')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= 100 && wordCount <= 300;
    }, 'Please write between 100 to 300 words'),
  startup_support_needs: z.string()
    .min(1, 'Please describe the support or resources you need')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= 100 && wordCount <= 300;
    }, 'Please write between 100 to 300 words'),
  experiences_interests_skills: z.string()
    .min(1, 'Please share your skills, interests and experiences')
    .refine((val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
      return wordCount >= 100 && wordCount <= 300;
    }, 'Please write between 100 to 300 words'),
  // Optional fields for backward compatibility
  functional_role: z.string().optional(),
  company_name: z.string().optional(),
  designation: z.string().optional(),
  about_company: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const communityRoles = [
  { value: 'Founder', label: 'Founder' },
  { value: 'Enabler', label: 'Enabler' },
  { value: 'Mentor', label: 'Mentor' },
  { value: 'Learner', label: 'Learner' },
  { value: 'Investor', label: 'Investor' },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { user, register, isRegisterLoading, registerError, isAuthenticated } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const termsAccepted = watch('terms_accepted') ?? false;

  // Redirect to profile page when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.profile_slug) {
      const intendedRedirect = sessionStorage.getItem('intended_redirect');
      if (intendedRedirect) {
        sessionStorage.removeItem('intended_redirect');
        sessionStorage.removeItem('intended_event');
        setLocation(intendedRedirect);
        return;
      }
      const intendedEvent = sessionStorage.getItem('intended_event');
      if (intendedEvent) {
        sessionStorage.removeItem('intended_event');
        setLocation(`/events/${intendedEvent}`);
      } else {
        setLocation(`/member/${user.profile_slug}`);
      }
    }
  }, [isAuthenticated, user?.profile_slug, setLocation]);

  // Redirect if already authenticated
  if (isAuthenticated && user?.profile_slug) {
    return null;
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      // User will be fetched by useAuth hook, useEffect will handle redirect
    } catch (error) {
      // Error handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-display font-bold text-center break-words">
            Join CEDAT Community
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Become a free CEDAT member to access events and connect with the ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm">1. Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="John Doe"
                    {...registerField('full_name')}
                    className={`min-h-[44px] ${errors.full_name ? 'border-destructive' : ''}`}
                  />
                  {errors.full_name && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">2. Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...registerField('phone')}
                    className={`min-h-[44px] ${errors.phone ? 'border-destructive' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">3. Mail ID *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...registerField('email')}
                    className={`min-h-[44px] ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">4. Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      {...registerField('password')}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="community_role" className="text-sm">5. Who Are You? *</Label>
                <Select 
                  value={watch('community_role')} 
                  onValueChange={(value) => setValue('community_role', value)}
                >
                  <SelectTrigger className={`min-h-[44px] ${errors.community_role ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select who you are" />
                  </SelectTrigger>
                  <SelectContent>
                    {communityRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.community_role && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.community_role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="text-sm">6. What is your Linkedin Profile? *</Label>
                <Input
                  id="linkedin_url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  {...registerField('linkedin_url')}
                  className={`min-h-[44px] ${errors.linkedin_url ? 'border-destructive' : ''}`}
                />
                {errors.linkedin_url && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.linkedin_url.message}</p>
                )}
              </div>
            </div>

            {/* Detailed Questions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_yourself" className="text-sm">
                  7. Write about Yourself (In 100 to 300 Words) *
                </Label>
                <Textarea
                  id="about_yourself"
                  placeholder="Tell us about yourself, your background, interests, and what drives you..."
                  {...registerField('about_yourself')}
                  rows={6}
                  className={`resize-y ${errors.about_yourself ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {watch('about_yourself') ? 
                      `${watch('about_yourself').trim().split(/\s+/).filter(w => w.length > 0).length} words` : 
                      '100 to 300 words'}
                  </p>
                  {errors.about_yourself && (
                    <p className="text-xs text-destructive">{errors.about_yourself.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="building_description" className="text-sm">
                  8. Kindly Share about your startup, project or services (In 100 to 300 Words) *
                </Label>
                <Textarea
                  id="building_description"
                  placeholder="Share details about your startup, project, or services..."
                  {...registerField('building_description')}
                  rows={6}
                  className={`resize-y ${errors.building_description ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {watch('building_description') ? 
                      `${watch('building_description').trim().split(/\s+/).filter(w => w.length > 0).length} words` : 
                      '100 to 300 words'}
                  </p>
                  {errors.building_description && (
                    <p className="text-xs text-destructive">{errors.building_description.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startup_support_needs" className="text-sm">
                  9. What kind of support or resources do you need for your startup, project or services (In 100 to 300 Words) *
                </Label>
                <Textarea
                  id="startup_support_needs"
                  placeholder="Describe the support or resources you need..."
                  {...registerField('startup_support_needs')}
                  rows={6}
                  className={`resize-y ${errors.startup_support_needs ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {watch('startup_support_needs') ? 
                      `${watch('startup_support_needs').trim().split(/\s+/).filter(w => w.length > 0).length} words` : 
                      '100 to 300 words'}
                  </p>
                  {errors.startup_support_needs && (
                    <p className="text-xs text-destructive">{errors.startup_support_needs.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experiences_interests_skills" className="text-sm">
                  10. Is there anything else you would like us to know about your skills, interests & experiences (In 100 to 300 Words) *
                </Label>
                <Textarea
                  id="experiences_interests_skills"
                  placeholder="Share your skills, interests, and experiences..."
                  {...registerField('experiences_interests_skills')}
                  rows={6}
                  className={`resize-y ${errors.experiences_interests_skills ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {watch('experiences_interests_skills') ? 
                      `${watch('experiences_interests_skills').trim().split(/\s+/).filter(w => w.length > 0).length} words` : 
                      '100 to 300 words'}
                  </p>
                  {errors.experiences_interests_skills && (
                    <p className="text-xs text-destructive">{errors.experiences_interests_skills.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms_accepted"
                  checked={termsAccepted || false}
                  onCheckedChange={(checked) => setValue('terms_accepted', checked === true)}
                  className={errors.terms_accepted ? 'border-destructive' : ''}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms_accepted"
                    className="text-sm font-normal leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="text-accent hover:underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    of the CEDAT Community *
                  </Label>
                  {errors.terms_accepted && (
                    <p className="text-sm text-destructive">{errors.terms_accepted.message}</p>
                  )}
                </div>
              </div>
            </div>

            {registerError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {registerError.message || 'Registration failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full min-h-[44px]"
              disabled={isRegisterLoading}
              size="lg"
            >
              {isRegisterLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Become a CEDAT Member'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
