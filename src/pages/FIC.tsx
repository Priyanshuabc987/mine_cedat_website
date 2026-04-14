import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useFICEvent, useRegisterForEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { registrationsAPI } from "@/lib/api";
import { generateSEO } from "@/lib/seo";
import { getImageUrl } from "@/lib/images";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    const isUrl = /^https?:\/\/\S+$/i.test(part);
    if (isUrl) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function FIC() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: event, isLoading, error } = useFICEvent();
  const { user, isAuthenticated } = useAuth();
  const registerMutation = useRegisterForEvent();
  const [showFICForm, setShowFICForm] = useState(false);
  const [networkingInterest, setNetworkingInterest] = useState<"" | "yes" | "no">("");
  const [pitchInterest, setPitchInterest] = useState<"" | "yes" | "no">("");

  const { data: registrationsData } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await registrationsAPI.getMyRegistrations();
      return await response.json();
    },
    enabled: isAuthenticated && !!user && !!event,
  });

  const isRegistered = Boolean(
    event && registrationsData?.items?.some((reg: { event_id: string }) => reg.event_id === event.id)
  );

  const handleConfirmParticipation = () => {
    if (!event) return;
    if (!isAuthenticated) {
      sessionStorage.setItem('intended_event', event.id);
      sessionStorage.setItem('intended_redirect', '/fic');
      setLocation('/register');
      return;
    }
    if (isRegistered) return;
    setShowFICForm(true);
  };

  const handleSubmitFICForm = async () => {
    if (!event || !isAuthenticated || isRegistered) return;
    if (!networkingInterest || !pitchInterest) {
      toast({
        title: "Please answer all questions",
        description: "Select Yes or No for both networking and pitching questions.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        eventId: event.id,
        metadata: {
          fic_networking_interest: networkingInterest === "yes",
          fic_pitch_interest: pitchInterest === "yes",
        },
      });
      if (result?.attendance_status === 'pending_approval') {
        toast({
          title: "Registration request submitted",
          description: "You will receive an email with your QR code once approved.",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "You're registered for FIC. Check your email for the QR code.",
        });
      }
      setShowFICForm(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      toast({ title: "Registration failed", description: message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 min-h-[44px] text-slate-200 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Back to Home
              </Button>
            </Link>
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8 sm:p-10 text-center shadow-2xl shadow-black/40">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold mb-3">
                FIC event coming soon
              </h1>
              <p className="text-slate-300 max-w-2xl mx-auto">
                The flagship FIC event is being curated. Once published by the admin, full details will appear here.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredImage = event.featured_image_url ? getImageUrl(event.featured_image_url) : undefined;
  const eventDate = new Date(event.event_date);
  const dateText = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeText = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const description =
    event.description ||
    `Join us for ${event.title} on ${dateText}. This FIC experience is curated by CEDAT for the ecosystem.`;

  return (
    <>
      {generateSEO({
        title: event.title || "FIC – CEDAT Flagship Event",
        description,
        keywords:
          "FIC, CEDAT flagship event, founder meetups bangalore, startup networking events bangalore, startup pitch events bangalore, startup community in bangalore, startup workshops bangalore, startup events in bengaluru, bengaluru startup meetups, Startup community meetups, Founders community meetup, Startup Pitches",
        image: featuredImage,
        url: "/fic",
        type: "event",
      })}

      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-50">
        <Navbar />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mb-6 sm:mb-10 flex items-center justify-between gap-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-[44px] px-3 sm:px-4 text-slate-200 hover:text-white hover:bg-slate-900/70"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* 1. Image first */}
            <section className="space-y-8 sm:space-y-10">
              <div className="relative max-w-4xl mx-auto">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-[2px] shadow-[0_0_60px_rgba(56,189,248,0.3)]">
                  <div className="rounded-[1.3rem] overflow-hidden bg-slate-900/80 aspect-square">
                    {featuredImage ? (
                      <img
                        src={featuredImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                        FIC visual coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Title */}
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  {event.title}
                </h1>
              </div>

              {/* 3. Date, time, location */}
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center sm:text-left">
                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Date</div>
                  <div className="text-sm sm:text-base font-semibold">{dateText}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center sm:text-left">
                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Time</div>
                  <div className="text-sm sm:text-base font-semibold">{timeText}</div>
                </div>
                {event.location && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center sm:text-left">
                    <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Location</div>
                    <div className="text-sm sm:text-base font-semibold break-words">
                      {event.location}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Confirm participation / FIC form */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  {isRegistered ? (
                    <Button
                      disabled
                      className="rounded-full bg-slate-700 text-slate-300 cursor-default px-6 sm:px-7"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Registered
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConfirmParticipation}
                      disabled={registerMutation.isPending}
                      className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 sm:px-7"
                    >
                      Confirm participation
                    </Button>
                  )}
                </div>

                {showFICForm && user && (
                  <Card className="max-w-xl mx-auto bg-slate-950/60 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400">Name</Label>
                        <Input
                          value={user.full_name}
                          readOnly
                          className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400">Email</Label>
                        <Input
                          value={user.email}
                          readOnly
                          className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                      {user.phone && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase text-slate-400">Phone Number</Label>
                          <Input
                            value={user.phone}
                            readOnly
                            className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-xs uppercase text-slate-400">LinkedIn Profile</Label>
                        <Input
                          value={user.linkedin_url}
                          readOnly
                          className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                      {user.designation && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase text-slate-400">Designation</Label>
                          <Input
                            value={user.designation}
                            readOnly
                            className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                          />
                        </div>
                      )}
                      {user.company_name && (
                        <div className="space-y-1">
                          <Label className="text-xs uppercase text-slate-400">Company / Website</Label>
                          <Input
                            value={user.company_name}
                            readOnly
                            className="bg-slate-900/60 border-slate-600 text-slate-100 placeholder:text-slate-500"
                          />
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <Label className="text-sm text-slate-100">
                          Interested for networking with Investors, Mentors, Enablers, Professionals & Entrepreneurs. Costs 499/- *
                        </Label>
                        <Select
                          value={networkingInterest}
                          onValueChange={(val: "yes" | "no") => setNetworkingInterest(val)}
                        >
                          <SelectTrigger className="bg-slate-900/60 border-slate-600 text-slate-100">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-slate-100">
                          Want to pitch your startup? We will share a link to submit your pitch deck. Only shortlisted startups will be invited to present on event day. A fee of ₹4999 applies only to shortlisted & confirmed startups to pitch on 7th March 2026 *
                        </Label>
                        <Select
                          value={pitchInterest}
                          onValueChange={(val: "yes" | "no") => setPitchInterest(val)}
                        >
                          <SelectTrigger className="bg-slate-900/60 border-slate-600 text-slate-100">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="min-h-[40px] border-slate-700 text-slate-200"
                          onClick={() => {
                            setShowFICForm(false);
                            setNetworkingInterest("");
                            setPitchInterest("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          className="min-h-[40px] bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                          onClick={handleSubmitFICForm}
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            "Confirm participation"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* 5. Description at last */}
              {event.description && (
                <div className="max-w-3xl mx-auto pt-4 border-t border-slate-800">
                  <h2 className="text-lg font-semibold text-slate-200 mb-3">About this event</h2>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                    {event.description.split("\n").map((paragraph, i) => (
                      <p key={i} className="mb-3 last:mb-0">
                        {linkifyText(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. FIC Gallery - uses event images uploaded via admin */}
              {event.images && event.images.length > 0 && (
                <div className="max-w-5xl mx-auto pt-8">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">FIC Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {event.images.map((img: any, index: number) => (
                      <div
                        key={img.id ?? index}
                        className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60"
                      >
                        <img
                          src={getImageUrl(img.image_url)}
                          alt={img.caption || `FIC gallery image ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

