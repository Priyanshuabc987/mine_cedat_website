import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { publicAPI } from '@/lib/api';
import { PublicProfileView } from '@/components/members/PublicProfileView';
import { ProfileQuestionsEdit } from '@/components/members/ProfileQuestionsEdit';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { generateSEO, generateProfileStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Profile slug is required');
      try {
        const response = await publicAPI.getPublicProfile(slug);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        console.error('Error fetching profile:', err);
        throw err;
      }
    },
    enabled: !!slug,
    retry: false,
  });

  // If public API failed but this is the current user's profile slug, show profile from auth user
  const isOwnProfile = isAuthenticated && user?.profile_slug === slug;
  const profileFromUser = isOwnProfile && user ? {
    id: user.id,
    full_name: user.full_name,
    linkedin_url: user.linkedin_url,
    community_role: user.community_role,
    functional_role: user.functional_role ?? null,
    company_name: user.company_name ?? null,
    designation: user.designation ?? null,
    profile_slug: user.profile_slug,
    profile_photo_url: user.profile_photo_url ?? null,
    created_at: (user as { created_at?: string }).created_at ?? new Date().toISOString(),
  } : null;

  // Use profile from API if available, otherwise fall back to user's own profile if it matches
  const displayProfile = profile ?? profileFromUser;
  
  // If there's an error and we don't have a fallback, show error
  const shouldShowError = error && !profileFromUser && !isLoading;

  if (isLoading && !profileFromUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (shouldShowError || (!displayProfile && !isLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24">
          <div className="container mx-auto px-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
              <p className="text-muted-foreground">
                The profile you're looking for doesn't exist or is no longer available.
              </p>
              {error && (
                <p className="text-sm text-muted-foreground mt-2">
                  Error: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileUrl = `/member/${displayProfile.profile_slug}`;
  const profileTitle = `${displayProfile.full_name} – CEDAT Community Member`;
  const profileDescription = `${displayProfile.full_name} is a ${displayProfile.community_role || 'member'} in the CEDAT ecosystem. ${displayProfile.functional_role || 'Professional'} at ${displayProfile.company_name || 'their organization'}. Connect and learn more about their journey in Bengaluru's startup ecosystem.`;
  const profileImage = displayProfile.profile_photo_url || undefined;
  const profileKeywords = [
    displayProfile.full_name,
    'CEDAT member',
    displayProfile.community_role,
    displayProfile.functional_role,
    displayProfile.company_name,
    'startup ecosystem',
    'Bengaluru entrepreneur',
    'tech professional'
  ].filter(Boolean).join(', ');

  return (
    <>
      {generateSEO({
        title: profileTitle,
        description: profileDescription,
        keywords: profileKeywords,
        image: profileImage,
        url: profileUrl,
        type: 'profile',
        imageAlt: `Profile photo of ${displayProfile.full_name}`,
        structuredData: [
          generateProfileStructuredData(displayProfile),
          generateBreadcrumbStructuredData([
            { name: 'Home', url: '/' },
            { name: 'Member Profile', url: profileUrl }
          ])
        ],
      })}

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 sm:mb-6 min-h-[44px] px-3 sm:px-4">
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Back to Home
              </Button>
            </Link>

            {/* Profile Content */}
            <PublicProfileView profile={displayProfile} />
            
            {/* Edit Questions Section - Only show for own profile */}
            {isOwnProfile && <ProfileQuestionsEdit />}
          </div>
        </main>
      </div>
    </>
  );
}
