import { useParams, useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventDetailView } from "@/components/events/EventDetailView";
import { RegistrationForm } from "@/components/events/RegistrationForm";
import { RegistrationConfirmation } from "@/components/events/RegistrationConfirmation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEvent, useRegisterForEvent, useUnregisterForEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { registrationsAPI } from "@/lib/api";
import { generateSEO, generateEventStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import { getImageUrl } from "@/lib/images";
import { API_BASE_URL } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EventDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const { data: event, isLoading, error } = useEvent(id!);
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterForEvent();

  const { data: registrationsData } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await registrationsAPI.getMyRegistrations();
      return await response.json();
    },
    enabled: isAuthenticated && !!user,
  });

  useEffect(() => {
    if (user && event && registrationsData?.items) {
      const registration = registrationsData.items.find(
        (reg: any) => reg.event_id === event.id
      );
      if (registration) {
        setIsRegistered(true);
        setRegistrationData(registration);
      } else {
        setIsRegistered(false);
        setRegistrationData(null);
      }
    } else if (!isAuthenticated || !user) {
      setIsRegistered(false);
      setRegistrationData(null);
    }
  }, [user, event, registrationsData, isAuthenticated]);

  const handleRegister = async () => {
    if (event?.external_registration_url) {
      window.open(event.external_registration_url, '_blank');
      return;
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('intended_event', id!);
      router.push('/register');
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({ eventId: id!, metadata: undefined });
      setIsRegistered(true);
      setRegistrationData(result);
      setShowConfirmation(true);
      if (result?.attendance_status === 'pending_approval') {
        toast({
          title: "Registration request submitted",
          description: "Your registration request has been submitted.",
        });
      } else {
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered for this event.",
        });
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = 'Failed to register for event. Please try again.';
      if (error?.message) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = error.message.replace(/^\d+:\s*/, '');
        }
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async () => {
    if (!registrationData?.id) return;

    try {
      await unregisterMutation.mutateAsync(registrationData.id);
      setIsRegistered(false);
      setRegistrationData(null);
      setShowConfirmation(false);
      toast({
        title: "Unregistered Successfully",
        description: "You have been unregistered from this event.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    } catch (error: any) {
      console.error('Unregistration failed:', error);
      let errorMessage = 'Failed to unregister from event.';
      if (error?.message) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = error.message.replace(/^\d+:\s*/, '');
        }
      }
      toast({
        title: "Unregistration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getCalendarUrl = () => {
    if (!event) return undefined;
    return `${API_BASE_URL}/api/events/${event.id}/calendar`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="mb-4 min-h-[44px]">
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Back to Events
              </Button>
            </Link>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
              <p className="text-muted-foreground">
                The event you're looking for doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventUrl = `/events/${event.id}`;
  const eventTitle = event.title;
  const eventDescription = event.description || `Join us for ${event.title}`;
  const eventImage = event.featured_image_url ? getImageUrl(event.featured_image_url) : undefined;

  return (
    <>
      {generateSEO({
        title: eventTitle,
        description: eventDescription,
        image: eventImage,
        url: eventUrl,
        type: 'event',
        publishedTime: new Date(event.event_date).toISOString(),
        imageAlt: `Event image for ${event.title}`,
        structuredData: [
          generateEventStructuredData(event),
          generateBreadcrumbStructuredData([
            { name: 'Home', url: '/' },
            { name: 'Events', url: '/events' },
            { name: event.title, url: eventUrl }
          ])
        ],
      })}

      <div className="min-h-screen bg-background">
        <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <Link href="/events">
            <Button variant="ghost" size="sm" className="mb-4 sm:mb-6 min-h-[44px] px-3 sm:px-4">
              <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
              Back to Events
            </Button>
          </Link>

          <div className="max-w-6xl mx-auto">
            <EventDetailView event={event} layout="centered">
              {!showConfirmation && (
                <RegistrationForm
                  event={event}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                  isRegistering={registerMutation.isPending}
                  isUnregistering={unregisterMutation.isPending}
                  isRegistered={isRegistered}
                  registrationData={registrationData || registerMutation.data}
                  onRegenerateSuccess={(newUrl) => setRegistrationData((prev: any) => (prev ? { ...prev, qr_code_image_url: newUrl } : null))}
                />
              )}
            </EventDetailView>
          </div>
        </div>
      </main>
      <Footer />

      {showConfirmation && event && registrationData && (
        <RegistrationConfirmation
          event={event}
          registrationData={registrationData}
          onClose={() => setShowConfirmation(false)}
          calendarUrl={getCalendarUrl()}
          onRegenerateSuccess={(newUrl) => setRegistrationData((prev: any) => (prev ? { ...prev, qr_code_image_url: newUrl } : null))}
        />
      )}
      </div>
    </>
  );
}
