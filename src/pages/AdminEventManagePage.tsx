import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  Download,
  QrCode,
  CheckCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useEvent,
  useUpdateEvent,
  useDeleteEvent,
  useUploadEventImage,
  useUpdateEventImage,
  useDeleteEventImage,
} from '@/hooks/useEvents';
import {
  useAdminEventRegistrations,
  useVerifyQRCode,
  useCheckInRegistration,
  useApproveRegistration,
} from '@/hooks/useAdmin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminSections } from '@/pages/AdminDashboard';
import { EventForm, eventSchema, type EventFormData } from '@/components/admin/EventManagement';
import { format } from 'date-fns';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { RegistrationMemberDetailSheet } from '@/components/admin/RegistrationMemberDetailSheet';
import { API_BASE_URL } from '@/lib/queryClient';

function parseQrCodeForVerify(raw: string): string {
  const s = (raw || '').trim();
  const lastPipe = s.lastIndexOf('|');
  return lastPipe >= 0 ? s.slice(lastPipe + 1) : s;
}

export default function AdminEventManagePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrManual, setQrManual] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<{
    type: 'wrong_event' | 'already_attended' | 'ok';
    registration?: { id: string; event_id: string; attendance_status: string };
    member?: { name: string; email: string; company: string };
  } | null>(null);
  const [regSearch, setRegSearch] = useState('');
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [editingCaptionValue, setEditingCaptionValue] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRegistrationId, setDetailRegistrationId] = useState<string | undefined>(undefined);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderId = 'qr-reader-mount';

  const { data: event, isLoading: eventLoading, error: eventError } = useEvent(id || '');
  const { data: regData, isLoading: regLoading, refetch: refetchRegs } = useAdminEventRegistrations(id || '');
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const uploadImage = useUploadEventImage();
  const updateEventImage = useUpdateEventImage();
  const deleteEventImage = useDeleteEventImage();
  const verifyQR = useVerifyQRCode();
  const checkIn = useCheckInRegistration();
  const approveRegistration = useApproveRegistration();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'draft',
      is_featured: false,
      category: '',
      theme: '',
    },
  });

  const onSectionChange = (s: string) => {
    router.push(s === 'overview' ? '/admin' : `/admin?section=${s}`);
  };

  useEffect(() => {
    if (!scannerOpen || !id) return;
    const html5Qr = new Html5Qrcode(qrReaderId);
    scannerRef.current = html5Qr;
    setVerifiedResult(null);

    html5Qr
      .start({ facingMode: 'environment' }, { fps: 10 }, (decodedText) => {
        if (verifiedResult?.type === 'ok') return;
        const qr = parseQrCodeForVerify(decodedText);
        if (!qr) return;
        verifyQR.mutateAsync(qr)
          .then((res: any) => {
            const reg = res?.registration;
            const mem = res?.member;
            if (!reg) {
              setVerifiedResult({ type: 'wrong_event' });
              return;
            }
            if (reg.event_id !== id) {
              setVerifiedResult({ type: 'wrong_event' });
              setTimeout(() => setVerifiedResult(null), 2500);
              return;
            }
            if (reg.attendance_status === 'attended') {
              setVerifiedResult({ type: 'already_attended' });
              setTimeout(() => setVerifiedResult(null), 2500);
              return;
            }
            setVerifiedResult({
              type: 'ok',
              registration: reg,
              member: mem ? { name: mem.name, email: mem.email, company: mem.company } : undefined,
            });
            html5Qr.stop().catch(() => {});
          })
          .catch(() => {
            setVerifiedResult({ type: 'wrong_event' });
            setTimeout(() => setVerifiedResult(null), 2500);
          });
      }, () => {})
      .catch((e) => {
        console.error('Scanner start failed:', e);
        toast({ title: 'Camera error', description: 'Could not start camera.', variant: 'destructive' });
      });

    return () => {
      html5Qr.stop().then(() => html5Qr.clear()).catch(() => {});
      scannerRef.current = null;
    };
  }, [scannerOpen, id, verifyQR, toast, verifiedResult?.type]);

  const handleUpdate = async (data: EventFormData) => {
    if (!id) return;
    try {
      await updateEvent.mutateAsync({ eventId: id, eventData: data });
      setEditOpen(false);
      toast({ title: 'Event updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update event.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast({ title: 'Event deleted' });
      router.push('/admin?section=events');
    } catch {
      toast({ title: 'Error', description: 'Failed to delete event.', variant: 'destructive' });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !id) return;
    try {
      for (const f of files) {
        await uploadImage.mutateAsync({ eventId: id, file: f });
      }
      toast({ title: 'Images uploaded', description: `Uploaded ${files.length} image(s).` });
      setUploadOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to upload images.', variant: 'destructive' });
    }
    e.target.value = '';
  };

  const handleExportCsv = async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE_URL}/api/admin/events/${id}/registrations?export_csv=true`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event_${id}_registrations.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'CSV exported' });
    } catch {
      toast({ title: 'Error', description: 'Failed to export CSV.', variant: 'destructive' });
    }
  };

  const handleManualVerify = async () => {
    const qr = parseQrCodeForVerify(qrManual);
    if (!qr) return;
    setVerifiedResult(null);
    try {
      const res: any = await verifyQR.mutateAsync(qr);
      const reg = res?.registration;
      const mem = res?.member;
      if (!reg) {
        setVerifiedResult({ type: 'wrong_event' });
        return;
      }
      if (reg.event_id !== id) {
        setVerifiedResult({ type: 'wrong_event' });
        return;
      }
      if (reg.attendance_status === 'attended') {
        setVerifiedResult({ type: 'already_attended' });
        return;
      }
      setVerifiedResult({
        type: 'ok',
        registration: reg,
        member: mem ? { name: mem.name, email: mem.email, company: mem.company } : undefined,
      });
    } catch {
      setVerifiedResult({ type: 'wrong_event' });
    }
  };

  const handleCheckInFromVerify = async () => {
    const r = verifiedResult?.type === 'ok' ? verifiedResult.registration : null;
    if (!r) return;
    try {
      await checkIn.mutateAsync(r.id);
      refetchRegs();
      setVerifiedResult(null);
      setQrManual('');
      if (scannerOpen) {
        setScannerOpen(false);
      }
      toast({ title: 'Checked in', description: 'Attendee marked as attended.' });
    } catch {
      toast({ title: 'Error', description: 'Check-in failed.', variant: 'destructive' });
    }
  };

  const handleMarkAttended = async (regId: string) => {
    try {
      await checkIn.mutateAsync(regId);
      refetchRegs();
      toast({ title: 'Marked as attended' });
    } catch {
      toast({ title: 'Error', description: 'Failed to mark as attended.', variant: 'destructive' });
    }
  };

  const sortedImages = [...(event?.images || [])].sort(
    (a: { display_order?: number }, b: { display_order?: number }) => (b.display_order ?? 0) - (a.display_order ?? 0)
  );

  const saveCaption = async () => {
    if (!editingCaptionId || !id) return;
    try {
      await updateEventImage.mutateAsync({
        eventId: id,
        imageId: editingCaptionId,
        body: { caption: editingCaptionValue || undefined },
      });
      setEditingCaptionId(null);
      toast({ title: 'Caption updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to update caption.', variant: 'destructive' });
    }
  };

  const moveUp = async (index: number) => {
    if (!id || index <= 0) return;
    const curr = sortedImages[index];
    const prev = sortedImages[index - 1];
    if (!curr || !prev) return;
    try {
      await updateEventImage.mutateAsync({
        eventId: id,
        imageId: curr.id,
        body: { display_order: prev.display_order ?? 0 },
      });
      await updateEventImage.mutateAsync({
        eventId: id,
        imageId: prev.id,
        body: { display_order: curr.display_order ?? 0 },
      });
      toast({ title: 'Order updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to reorder.', variant: 'destructive' });
    }
  };

  const moveDown = async (index: number) => {
    if (!id || index < 0 || index >= sortedImages.length - 1) return;
    const curr = sortedImages[index];
    const next = sortedImages[index + 1];
    if (!curr || !next) return;
    try {
      await updateEventImage.mutateAsync({
        eventId: id,
        imageId: curr.id,
        body: { display_order: next.display_order ?? 0 },
      });
      await updateEventImage.mutateAsync({
        eventId: id,
        imageId: next.id,
        body: { display_order: curr.display_order ?? 0 },
      });
      toast({ title: 'Order updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to reorder.', variant: 'destructive' });
    }
  };

  const setFeatured = async (img: { image_url?: string }) => {
    if (!id || !img?.image_url) return;
    try {
      await updateEvent.mutateAsync({ eventId: id, eventData: { featured_image_url: img.image_url } });
      toast({ title: 'Featured image updated' });
    } catch {
      toast({ title: 'Error', description: 'Failed to set featured image.', variant: 'destructive' });
    }
  };

  const handleDeleteImg = async (img: { id: string }) => {
    if (!id || !img?.id || !confirm('Delete this image?')) return;
    try {
      await deleteEventImage.mutateAsync({ eventId: id, imageId: img.id });
      toast({ title: 'Image deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete image.', variant: 'destructive' });
    }
  };

  const regItems = (regData?.items || []) as any[];
  const filteredRegs = regSearch.trim()
    ? regItems.filter(
        (r) =>
          (r.member?.full_name || '').toLowerCase().includes(regSearch.toLowerCase()) ||
          (r.member?.email || '').toLowerCase().includes(regSearch.toLowerCase())
      )
    : regItems;

  if (!id) {
    return (
      <AdminLayout sections={adminSections} activeSection="events" onSectionChange={onSectionChange}>
        <div className="text-center py-12 text-muted-foreground">Invalid event.</div>
      </AdminLayout>
    );
  }

  if (eventLoading || eventError || !event) {
    return (
      <AdminLayout sections={adminSections} activeSection="events" onSectionChange={onSectionChange}>
        <div className="flex items-center justify-center py-12">
          {eventLoading && <Loader2 className="h-8 w-8 animate-spin" />}
          {(eventError || !event) && !eventLoading && (
            <div className="text-center">
              <p className="text-muted-foreground">Event not found.</p>
              <Link href="/admin?section=events">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Button>
              </Link>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  const openEdit = () => {
    setValue('title', event.title);
    setValue('description', event.description || '');
    setValue('event_date', event.event_date?.includes('T') ? event.event_date.slice(0, 16) : `${(event.event_date || '').split('T')[0]}T00:00`);
    setValue('location', event.location || '');
    setValue('status', event.status as any);
    setValue('is_featured', event.is_featured || false);
    setValue('category', event.category ?? '');
    setValue('theme', event.theme ?? '');
    setEditOpen(true);
  };

  const stats = regData?.statistics || { total_registered: 0, total_attended: 0, total_pending: 0 };

  return (
    <AdminLayout sections={adminSections} activeSection="events" onSectionChange={onSectionChange}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin?section=events">
              <Button variant="ghost" size="sm" className="min-h-[44px]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold break-words">{event.title}</h1>
              <p className="text-muted-foreground">
                {format(new Date(event.event_date), 'PPP p')}
                {event.location && ` · ${event.location}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={openEdit} className="min-h-[44px]">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)} className="min-h-[44px]">
                <Upload className="w-4 h-4 mr-2" />
                Upload images
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} className="min-h-[44px]">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Event images</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)} className="min-h-[44px]">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </CardHeader>
          <CardContent>
            {!event.images?.length && !event.featured_image_url ? (
              <p className="text-muted-foreground py-4">No images yet. Use Upload images above.</p>
            ) : (
              <div className="space-y-3">
                {sortedImages.map((img: any, i: number) => {
                  const isFeatured =
                    (img.image_url || '').split('?')[0] === (event?.featured_image_url || '').split('?')[0];
                  return (
                    <div
                      key={img.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      <ImageWithFallback
                        src={img.image_url || ''}
                        alt={img.caption || 'Event image'}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {editingCaptionId === img.id ? (
                          <div className="flex flex-wrap gap-2 items-center">
                            <Input
                              value={editingCaptionValue}
                              onChange={(e) => setEditingCaptionValue(e.target.value)}
                              className="flex-1 min-w-[140px]"
                              placeholder="Caption"
                            />
                            <Button size="sm" onClick={saveCaption} disabled={updateEventImage.isPending}>
                              {updateEventImage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingCaptionId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">{img.caption || '—'}</span>
                            {isFeatured && (
                              <Badge variant="default" className="gap-1">
                                <Star className="w-3 h-3" />
                                Featured
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => {
                                setEditingCaptionId(img.id);
                                setEditingCaptionValue(img.caption || '');
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => moveUp(i)}
                          disabled={i === 0 || updateEventImage.isPending}
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => moveDown(i)}
                          disabled={i === sortedImages.length - 1 || updateEventImage.isPending}
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          onClick={() => setFeatured(img)}
                          disabled={isFeatured || updateEvent.isPending}
                          title="Set as featured"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Set as featured
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteImg(img)}
                          disabled={deleteEventImage.isPending}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle>Registrations</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {stats.total_registered} · Attended: {stats.total_attended}
                  {stats.total_pending > 0 && ` · Pending: ${stats.total_pending}`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="min-h-[44px] w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {regLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredRegs.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No registrations.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checked-in At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegs.map((r: any) => (
                      <TableRow
                        key={r.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setDetailRegistrationId(r.id); setDetailOpen(true); }}
                      >
                        <TableCell className="break-words">{r.member?.full_name ?? '—'}</TableCell>
                        <TableCell className="break-words">{r.member?.email ?? '—'}</TableCell>
                        <TableCell className="break-words">{r.member?.company_name ?? '—'}</TableCell>
                        <TableCell>{r.registration_date ? format(new Date(r.registration_date), 'PP') : '—'}</TableCell>
                        <TableCell>
                          <Badge variant={r.attendance_status === 'attended' ? 'default' : 'secondary'}>
                            {r.attendance_status === 'pending_approval' ? 'Pending' : r.attendance_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.checked_in_at ? format(new Date(r.checked_in_at), 'pp') : '—'}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {r.attendance_status === 'pending_approval' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="min-h-[44px]"
                              onClick={async () => {
                                try {
                                  await approveRegistration.mutateAsync(r.id);
                                  refetchRegs();
                                  toast({ title: 'Registration approved', description: 'QR code and confirmation email have been sent.' });
                                } catch {
                                  toast({ title: 'Error', description: 'Failed to approve registration.', variant: 'destructive' });
                                }
                              }}
                              disabled={approveRegistration.isPending}
                            >
                              {approveRegistration.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                            </Button>
                          )}
                          {r.attendance_status !== 'attended' && r.attendance_status !== 'pending_approval' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="min-h-[44px]"
                              onClick={() => handleMarkAttended(r.id)}
                              disabled={checkIn.isPending}
                            >
                              {checkIn.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Mark as Attended
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Check-In
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use on event day to scan attendee QR codes.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setScannerOpen(true)} className="min-h-[44px]">
                <QrCode className="w-4 h-4 mr-2" />
                Open scanner
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <Input
                  placeholder="Or paste QR code..."
                  value={qrManual}
                  onChange={(e) => setQrManual(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                />
                <Button
                  variant="outline"
                  onClick={handleManualVerify}
                  disabled={!qrManual.trim() || verifyQR.isPending}
                  className="min-h-[44px]"
                >
                  {verifyQR.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </Button>
              </div>
            </div>
            {verifyQR.error && (
              <Alert variant="destructive">
                <AlertDescription>Invalid QR code. Please check and try again.</AlertDescription>
              </Alert>
            )}
            {verifiedResult?.type === 'ok' && verifiedResult.registration && (
              <Alert className="border-green-200 bg-green-50/50">
                <AlertDescription>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-medium text-green-800">
                        {verifiedResult.member?.name || 'Attendee'} · {verifiedResult.member?.email || ''}
                      </p>
                      <p className="text-sm text-green-700">{verifiedResult.member?.company}</p>
                    </div>
                    <Button
                      onClick={handleCheckInFromVerify}
                      disabled={checkIn.isPending}
                      className="min-h-[44px] shrink-0"
                    >
                      {checkIn.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Attended
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            register={registerField}
            setValue={setValue}
            watch={watch}
            errors={errors}
            isSubmitting={updateEvent.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Upload Event Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Select images</Label>
            <Input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploadImage.isPending} />
            {uploadImage.isPending && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading…</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RegistrationMemberDetailSheet
        open={detailOpen}
        onOpenChange={(o) => { setDetailOpen(o); if (!o) setDetailRegistrationId(undefined); }}
        mode="registration"
        registrationId={detailRegistrationId}
      />

      <Dialog open={scannerOpen} onOpenChange={(o) => { setScannerOpen(o); setVerifiedResult(null); }}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div id={qrReaderId} className="w-full min-h-[200px] bg-muted rounded-lg" />
          {verifiedResult?.type === 'ok' && (
            <div className="mt-4 p-3 rounded-lg border border-green-200 bg-green-50/50">
              <p className="font-medium text-green-800">{verifiedResult.member?.name} · {verifiedResult.member?.email}</p>
              <Button
                onClick={handleCheckInFromVerify}
                disabled={checkIn.isPending}
                className="mt-2 min-h-[44px]"
              >
                {checkIn.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Attended
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
