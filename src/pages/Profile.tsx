import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { publicAPI } from '@/lib/api';
import { PublicProfileView } from '@/components/members/PublicProfileView';
import { ProfileQuestionsEdit } from '@/components/members/ProfileQuestionsEdit';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { generateSEO, generateProfileStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { slug } = useParams() as { slug: string };
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
    created_at: (user as any).created_at ?? new Date().toISOString(),
  } : null;

  const displayProfile = profile ?? profileFromUser;
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
                The profile you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileUrl = `/member/${displayProfile.profile_slug}`;
  const profileTitle = `${displayProfile.full_name} – CEDAT Community Member`;

  return (
    <>
      {generateSEO({
        title: profileTitle,
        description: `${displayProfile.full_name} profile`,
        url: profileUrl,
        type: 'profile',
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
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 sm:mb-6 min-h-[44px] px-3 sm:px-4">
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Back to Home
              </Button>
            </Link>

            <PublicProfileView profile={displayProfile} />
            
            {isOwnProfile && <ProfileQuestionsEdit />}
          </div>
        </main>
      </div>
    </>
  );
}
