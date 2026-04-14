
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEvent, useRegisterForEvent, useUnregisterForEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { registrationsAPI } from "@/lib/api";
import { EventDetailView } from "@/components/events/EventDetailView";
import { RegistrationForm } from "@/components/events/RegistrationForm";
import { RegistrationConfirmation } from "@/components/events/RegistrationConfirmation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const { data: event, isLoading, error } = useEvent(id);
  const registerMutation = useRegisterForEvent();
  const unregisterMutation = useUnregisterForEvent();

  const { data: regsData } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await registrationsAPI.getMyRegistrations();
      return await response.json();
    },
    enabled: isAuthenticated && !!user,
  });

  useEffect(() => {
    if (user && event && regsData?.items) {
      const reg = regsData.items.find((r: any) => r.event_id === event.id);
      if (reg) {
        setIsRegistered(true);
        setRegistrationData(reg);
      }
    }
  }, [user, event, regsData]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }
    try {
      const res = await registerMutation.mutateAsync({ eventId: id, metadata: null });
      setIsRegistered(true);
      setRegistrationData(res);
      setShowConfirmation(true);
      toast({ title: "Registered Successfully" });
    } catch (e) {
      toast({ title: "Registration Failed", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  if (!event) {
    return <div className="min-h-screen pt-32 text-center">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/events">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <EventDetailView event={event} layout="centered">
            {!showConfirmation && (
              <RegistrationForm
                event={event}
                onRegister={handleRegister}
                isRegistering={registerMutation.isPending}
                isRegistered={isRegistered}
                registrationData={registrationData}
              />
            )}
          </EventDetailView>
        </div>
      </div>

      {showConfirmation && (
        <RegistrationConfirmation
          event={event}
          registrationData={registrationData}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}
