import { useState, useRef } from 'react';
import { useForm, UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Users, Upload, Link as LinkIcon } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useUploadEventImage } from '@/hooks/useEvents';
import { format } from 'date-fns';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
  is_featured: z.boolean().optional(),
  category: z.string().optional(),
  theme: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled']),
  featured_image_url: z.union([
    z.string(),
    z.literal(''),
    z.undefined()
  ]).optional(),
  external_registration_url: z.union([
    z.string(),
    z.literal(''),
    z.undefined()
  ]).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

export function EventManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedEventForImages, setSelectedEventForImages] = useState<string | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
  const { toast } = useToast();

  const { data: events, isLoading } = useEvents({ page_size: 50 });
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const uploadImage = useUploadEventImage();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    reset,
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

  const handleCreateEvent = async (data: EventFormData) => {
    setIsCreating(true);
    try {
      // Build a plain serializable payload for the API (avoid passing form state that may contain refs/DOM)
      const payload: any = {
        title: data.title,
        description: data.description ?? undefined,
        event_date: data.event_date,
        location: data.location ?? undefined,
        is_featured: data.is_featured ?? false,
        category: data.category || undefined,
        theme: data.theme || undefined,
        status: data.status,
        external_registration_url: data.external_registration_url && data.external_registration_url.trim() ? data.external_registration_url.trim() : undefined,
      };
      
      // If URL is provided, include it in the create payload
      if (imageInputType === 'url' && data.featured_image_url && data.featured_image_url.trim()) {
        payload.featured_image_url = data.featured_image_url.trim();
      }
      
      const created = await createEvent.mutateAsync(payload);
      
      // Handle file uploads (for gallery images)
      let firstImageUrl: string | null = null;
      if (imageInputType === 'upload' && pendingImages.length > 0) {
        for (let i = 0; i < pendingImages.length; i++) {
          const res = await uploadImage.mutateAsync({ eventId: created.id, file: pendingImages[i] });
          if (i === 0) firstImageUrl = res.image_url;
        }
        // If we uploaded files and no URL was set, use first uploaded image as featured
        if (firstImageUrl && !payload.featured_image_url) {
          await updateEvent.mutateAsync({ eventId: created.id, eventData: { featured_image_url: firstImageUrl } });
        }
      }
      
      setIsCreateDialogOpen(false);
      reset();
      setPendingImages([]);
      setImageInputType('upload');
      toast({
        title: 'Event created',
        description: imageInputType === 'url' && data.featured_image_url 
          ? 'Event created with image URL.' 
          : pendingImages.length 
            ? `Event and ${pendingImages.length} image(s) added.` 
            : 'Event created.',
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({ title: 'Error', description: 'Failed to create event.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!editingEvent) return;

    try {
      const payload: any = {
        title: data.title,
        description: data.description ?? undefined,
        event_date: data.event_date,
        location: data.location ?? undefined,
        is_featured: data.is_featured ?? false,
        category: data.category || undefined,
        theme: data.theme || undefined,
        status: data.status,
        external_registration_url: data.external_registration_url && data.external_registration_url.trim() ? data.external_registration_url.trim() : undefined,
      };
      
      // If URL is provided, include it in the update payload
      if (imageInputType === 'url' && data.featured_image_url && data.featured_image_url.trim()) {
        payload.featured_image_url = data.featured_image_url.trim();
      } else if (imageInputType === 'url' && (!data.featured_image_url || !data.featured_image_url.trim())) {
        // If switching to URL but no URL provided, clear it
        payload.featured_image_url = null;
      }
      
      await updateEvent.mutateAsync({ eventId: editingEvent.id, eventData: payload });
      
      // Handle file uploads for edit (add to gallery)
      if (imageInputType === 'upload' && pendingImages.length > 0) {
        let firstImageUrl: string | null = null;
        for (let i = 0; i < pendingImages.length; i++) {
          const res = await uploadImage.mutateAsync({ eventId: editingEvent.id, file: pendingImages[i] });
          if (i === 0) firstImageUrl = res.image_url;
        }
        // If no featured image exists and we uploaded files, set first as featured
        if (!editingEvent.featured_image_url && firstImageUrl) {
          await updateEvent.mutateAsync({ eventId: editingEvent.id, eventData: { featured_image_url: firstImageUrl } });
        }
      }
      
      setEditingEvent(null);
      reset();
      setPendingImages([]);
      setImageInputType('upload');
      toast({
        title: 'Event updated',
        description: 'Event updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      toast({ title: 'Error', description: 'Failed to update event.', variant: 'destructive' });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent.mutateAsync(eventId);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !selectedEventForImages) return;
    try {
      for (const file of files) {
        await uploadImage.mutateAsync({ eventId: selectedEventForImages, file });
      }
      toast({ title: 'Images uploaded', description: `Uploaded ${files.length} image(s).` });
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({ title: 'Error', description: 'Failed to upload some images.', variant: 'destructive' });
    }
    e.target.value = '';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const eventsList = events?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold break-words">Event Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage community events</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { setIsCreateDialogOpen(open); if (!open) setPendingImages([]); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm
              onSubmit={handleSubmit(handleCreateEvent)}
              onCancel={() => { setIsCreateDialogOpen(false); setPendingImages([]); setImageInputType('upload'); }}
              register={registerField}
              setValue={setValue}
              watch={watch}
              errors={errors}
              isSubmitting={isCreating}
              showImageUpload
              pendingImages={pendingImages}
              onPendingImagesChange={setPendingImages}
              imageInputType={imageInputType}
              onImageInputTypeChange={setImageInputType}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : eventsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          ) : (
            <div className="relative overflow-auto max-h-[600px] overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {eventsList.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {format(new Date(event.event_date), 'PPP')}
                    </TableCell>
                    <TableCell>{event.location || 'TBD'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Users className="w-4 h-4" />
                        Manage ({event.registration_count || 0})
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEventForImages(event.id)}
                      >
                        <Upload className="w-4 h-4 flex-shrink-0" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingEvent(event);
                          setValue('title', event.title);
                          setValue('description', event.description || '');
                          setValue('event_date', event.event_date.includes('T') ? event.event_date.slice(0, 16) : `${event.event_date.split('T')[0]}T00:00`);
                          setValue('location', event.location || '');
                          setValue('status', event.status);
                          setValue('is_featured', event.is_featured || false);
                          setValue('category', event.category ?? '');
                          setValue('theme', event.theme ?? '');
                          setValue('external_registration_url', event.external_registration_url || '');
                          // Set image URL if exists, otherwise default to upload
                          if (event.featured_image_url) {
                            setValue('featured_image_url', event.featured_image_url);
                            setImageInputType('url');
                          } else {
                            setValue('featured_image_url', '');
                            setImageInputType('upload');
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 flex-shrink-0" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4 flex-shrink-0" />
                      </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleSubmit(handleUpdateEvent)}
            onCancel={() => { setEditingEvent(null); setPendingImages([]); setImageInputType('upload'); }}
            register={registerField}
            setValue={setValue}
            watch={watch}
            errors={errors}
            isSubmitting={updateEvent.isPending}
            showImageUpload
            pendingImages={pendingImages}
            onPendingImagesChange={setPendingImages}
            imageInputType={imageInputType}
            onImageInputTypeChange={setImageInputType}
          />
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={!!selectedEventForImages} onOpenChange={(open) => !open && setSelectedEventForImages(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Upload Event Images</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="image-upload">Select Images</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadImage.isPending}
              />
            </div>
            {uploadImage.isPending && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                <span>Uploading...</span>
              </div>
            )}
            {uploadImage.error && (
              <Alert variant="destructive">
                <AlertDescription>Failed to upload image. Please try again.</AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  register: UseFormRegister<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
  watch: UseFormWatch<EventFormData>;
  errors: FieldErrors<EventFormData>;
  isSubmitting: boolean;
  showImageUpload?: boolean;
  pendingImages?: File[];
  onPendingImagesChange?: (files: File[]) => void;
  imageInputType?: 'upload' | 'url';
  onImageInputTypeChange?: (type: 'upload' | 'url') => void;
}

export function EventForm({ onSubmit, onCancel, register, setValue, watch, errors, isSubmitting, showImageUpload, pendingImages, onPendingImagesChange, imageInputType = 'upload', onImageInputTypeChange }: EventFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            {...register('title')}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date & Time *</Label>
          <Input
            id="event_date"
            type="datetime-local"
            {...register('event_date')}
            className={errors.event_date ? 'border-destructive' : ''}
          />
          {errors.event_date && (
            <p className="text-sm text-destructive">{errors.event_date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category (e.g. Workshop, Conference, Meetup)</Label>
          <Input
            id="category"
            {...register('category')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme (e.g. Tech, Finance, Sustainability)</Label>
          <Input
            id="theme"
            {...register('theme')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={watch('status')} onValueChange={(value) => setValue('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_featured">Event Type</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_featured"
              checked={watch('is_featured') || false}
              onCheckedChange={(checked) => setValue('is_featured', !!checked)}
            />
            <Label htmlFor="is_featured" className="text-sm font-normal cursor-pointer">
              CEDAT Signature Event (Flagship)
            </Label>
          </div>
        </div>
      </div>

      {showImageUpload && (
        <div className="space-y-3">
          <Label>Featured Image (optional)</Label>
          
          {/* Toggle between Upload and URL */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={imageInputType === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onImageInputTypeChange?.('upload');
                setValue('featured_image_url', '');
              }}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button
              type="button"
              variant={imageInputType === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onImageInputTypeChange?.('url');
                onPendingImagesChange?.([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              URL
            </Button>
          </div>

          {/* Upload Option */}
          {imageInputType === 'upload' && (
            <div className="space-y-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => onPendingImagesChange?.(Array.from(e.target.files || []))}
              />
              {pendingImages && pendingImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{pendingImages.map((f) => f.name).join(', ')}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onPendingImagesChange?.([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* URL Option */}
          {imageInputType === 'url' && (
            <div className="space-y-2">
              <Input
                id="featured_image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                {...register('featured_image_url')}
                className={errors.featured_image_url ? 'border-destructive' : ''}
              />
              {errors.featured_image_url && (
                <p className="text-sm text-destructive">{errors.featured_image_url.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a direct link to an image (e.g., https://cedat-uploads-123.s3.ap-south-1.amazonaws.com/cedatevents/image.jpg)
              </p>
            </div>
          )}
        </div>
      )}

      {/* External Registration URL */}
      <div className="space-y-2">
        <Label htmlFor="external_registration_url">External Registration URL (optional)</Label>
        <Input
          id="external_registration_url"
          type="url"
          placeholder="https://lu.ma/event/example or https://eventbrite.com/..."
          {...register('external_registration_url')}
          className={errors.external_registration_url ? 'border-destructive' : ''}
        />
        {errors.external_registration_url && (
          <p className="text-sm text-destructive">{errors.external_registration_url.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          If provided, "Confirm Participation" button will redirect to this external link instead of internal registration.
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="min-h-[44px]">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-h-[44px]">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
              Saving...
            </>
          ) : (
            'Save Event'
          )}
        </Button>
      </div>
    </form>
  );
}
