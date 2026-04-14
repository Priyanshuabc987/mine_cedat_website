import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/members/ProfileForm';
import { ProfilePhotoUpload } from '@/components/members/ProfilePhotoUpload';
import { QRCodeDisplay } from '@/components/events/QRCodeDisplay';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationsAPI } from '@/lib/api';
import { generateSEO, seoConfigs } from '@/lib/seo';
import { getImageUrl } from '@/lib/images';
import { Calendar, Download, QrCode, Settings, User, LogOut, ExternalLink, Copy, Check, X, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const response = await registrationsAPI.getMyRegistrations();
      return await response.json();
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await registrationsAPI.unregister(registrationId);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Unregistration failed: ${response.status}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      toast({
        title: "Unregistered Successfully",
        description: "You have been unregistered from the event.",
      });
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to unregister from event. Please try again.';
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
    },
  });

  const handleUnregister = async (registrationId: string) => {
    unregisterMutation.mutate(registrationId);
  };

  const handleDownloadQR = async (registrationId: string) => {
    try {
      const response = await registrationsAPI.downloadQRCode(registrationId);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr_code_${registrationId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleCopyProfileUrl = () => {
    if (!user?.profile_slug) return;
    const profileUrl = `${window.location.origin}/member/${user.profile_slug}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!user) return null;

  const registrationItems = registrations?.items || [];

  return (
    <>
      {generateSEO(seoConfigs.dashboard)}
      <AuthGuard>
        <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 sm:mb-2 break-words">Welcome back, {user.full_name.split(' ')[0]}!</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your CEDAT membership and event registrations</p>
              </div>
              <Button variant="outline" onClick={logout} className="w-full sm:w-auto flex-shrink-0 min-h-[44px] px-4 sm:px-6">
                <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                Logout
              </Button>
            </div>

            {/* Dashboard Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
              <TabsList className="grid w-full grid-cols-3 overflow-x-auto min-h-[44px]">
                <TabsTrigger value="overview" className="text-xs sm:text-sm min-h-[44px]">Overview</TabsTrigger>
                <TabsTrigger value="profile" className="text-xs sm:text-sm min-h-[44px]">Your CEDAT Identity</TabsTrigger>
                <TabsTrigger value="registrations" className="text-xs sm:text-sm min-h-[44px]">My Events</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Profile Summary */}
                  <Card>
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        Your Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {user.profile_photo_url ? (
                          <img
                            src={getImageUrl(user.profile_photo_url)}
                            alt={user.full_name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-accent/30 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-lg sm:text-xl font-extrabold text-accent-foreground border-2 border-accent/30 flex-shrink-0">
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                        )}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-0">
                            <span className="text-xs sm:text-sm text-muted-foreground">Name</span>
                            <span className="text-xs sm:text-sm font-medium truncate">{user.full_name}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-0">
                            <span className="text-xs sm:text-sm text-muted-foreground">Role</span>
                            <span className="text-xs sm:text-sm font-medium truncate">{user.community_role}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-0">
                            <span className="text-xs sm:text-sm text-muted-foreground">Company</span>
                            <span className="text-xs sm:text-sm font-medium truncate">{user.company_name}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Registration Stats */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Event Registrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent mb-2">
                        {registrationItems.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Events registered for
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4 sm:p-6">
                      <Link href="/events">
                        <Button variant="outline" size="sm" className="w-full justify-start min-h-[44px]">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          Browse Events
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start min-h-[44px]"
                        onClick={() => setActiveTab('profile')}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Registrations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Event Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : registrationItems.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">No event registrations yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Register for your first CEDAT event to get started
                          </p>
                          <Link href="/events">
                            <Button>Browse Events</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registrationItems.slice(0, 3).map((reg: any) => {
                          const isPending = reg.attendance_status === 'pending_approval';
                          const statusLabel = isPending ? 'Pending approval' : reg.attendance_status;
                          return (
                          <div key={reg.id} className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{reg.event_title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(reg.event_date).toLocaleDateString()} • {statusLabel}
                                </p>
                              </div>
                              {!isPending && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadQR(reg.id)}
                                >
                                  <QrCode className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            {/* Show QR Code */}
                            <div className="pl-4">
                              <QRCodeDisplay
                                qrCode={reg.qr_code}
                                qrCodeImageUrl={reg.qr_code_image_url}
                                eventTitle={reg.event_title}
                                eventDate={reg.event_date}
                                eventLocation={undefined}
                                registrationDate={reg.registration_date}
                                memberRole={reg.member_role}
                                onDownload={() => handleDownloadQR(reg.id)}
                                registrationId={reg.id}
                                onRegenerateSuccess={() => queryClient.invalidateQueries({ queryKey: ['my-registrations'] })}
                              />
                            </div>
                          </div>
                          );
                        }) }
                        {registrationItems.length > 3 && (
                          <Button
                            variant="outline"
                            className="w-full min-h-[44px]"
                            onClick={() => setActiveTab('registrations')}
                          >
                            View All Registrations
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                {/* Public Profile Section */}
                {user?.profile_slug && (
                  <Card>
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg">Your Public Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 sm:p-6">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Your public profile is visible to anyone with the link. Share it to showcase your CEDAT membership.
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 p-3 bg-muted rounded-lg border min-w-0">
                          <code className="text-xs sm:text-sm break-all">
                            {window.location.origin}/member/{user.profile_slug}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyProfileUrl}
                            title="Copy profile URL"
                            className="min-w-[44px] min-h-[44px] flex-shrink-0"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <a href={`/member/${user.profile_slug}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" title="Open profile in new tab" className="min-w-[44px] min-h-[44px] flex-shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600">Profile URL copied to clipboard!</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Profile Photo Upload */}
                <ProfilePhotoUpload />

                {/* Profile Completion Notice */}
                {user && (!user.full_name || !user.linkedin_url || !user.community_role || !user.functional_role || !user.company_name || !user.designation || !user.phone) && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-blue-900">Complete Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-blue-800 mb-2">
                        Your profile is incomplete. Please fill in all required fields to get the most out of your CEDAT membership.
                      </p>
                      <p className="text-xs text-blue-700">
                        Required fields: Full Name, LinkedIn URL, Community Role, Functional Role, Company Name, Designation, and Phone Number.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Edit Profile Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Your Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Registrations Tab */}
              <TabsContent value="registrations">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">My Event Registrations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {isLoading ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : registrationItems.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 space-y-4">
                        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium text-sm sm:text-base">No event registrations yet</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                            Register for your first CEDAT event to get started
                          </p>
                          <Link href="/events">
                            <Button className="min-h-[44px] px-4 sm:px-6">Browse Events</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 sm:space-y-6">
                        {registrationItems.map((reg: any) => {
                          const isPendingReg = reg.attendance_status === 'pending_approval';
                          const statusLabel = isPendingReg ? 'Pending approval' : reg.attendance_status;
                          return (
                          <div key={reg.id} className="space-y-3 sm:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base break-words">{reg.event_title}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  {new Date(reg.event_date).toLocaleDateString()} • Registered on {new Date(reg.registration_date).toLocaleDateString()}
                                </p>
                                <Badge variant={reg.attendance_status === 'attended' ? 'default' : 'secondary'} className="mt-1 sm:mt-2 text-xs">
                                  {statusLabel}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                {!isPendingReg && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleDownloadQR(reg.id)}
                                  className="min-h-[44px] px-3 sm:px-4"
                                >
                                  <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="hidden sm:inline">QR Code</span>
                                  <span className="sm:hidden">QR</span>
                                </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      disabled={unregisterMutation.isPending}
                                      className="min-w-[44px] min-h-[44px]"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Unregister from Event?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel your registration for <strong>{reg.event_title}</strong>? 
                                        You will lose access to your QR code and will need to register again if you change your mind.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep Registration</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUnregister(reg.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Yes, Unregister
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            <div className="max-w-xs">
                              <QRCodeDisplay
                                qrCode={reg.qr_code}
                                qrCodeImageUrl={reg.qr_code_image_url}
                                eventTitle={reg.event_title}
                                eventDate={reg.event_date}
                                eventLocation={undefined}
                                registrationDate={reg.registration_date}
                                memberRole={reg.member_role}
                                onDownload={() => handleDownloadQR(reg.id)}
                                registrationId={reg.id}
                                onRegenerateSuccess={() => queryClient.invalidateQueries({ queryKey: ['my-registrations'] })}
                              />
                            </div>
                            <Separator />
                          </div>
                          );
                        }) }
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
    </>
  );
}
