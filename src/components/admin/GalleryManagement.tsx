import { useMemo, useRef } from 'react';
import { useDeleteGalleryImage, useGalleryImages, useUploadGalleryImages } from '@/hooks/useGallery';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Delete, Upload } from 'lucide-react';

export function GalleryManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: images, isLoading } = useGalleryImages(true);
  const uploadMutation = useUploadGalleryImages();
  const deleteMutation = useDeleteGalleryImage();

  const sortedImages = useMemo(() => {
    const list = images ?? [];
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [images]);

  const onPickAndUpload = async (pickedFiles: FileList | null) => {
    if (!pickedFiles || pickedFiles.length === 0) return;
    const files = Array.from(pickedFiles);

    try {
      await uploadMutation.mutateAsync(files);
      toast({ title: 'Gallery updated', description: `${files.length} image(s) uploaded.` });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      toast({ title: 'Gallery upload failed', description: msg, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 break-words">Gallery Images</h1>
        <p className="text-sm sm:text-base text-muted-foreground break-words">
          Manage the public gallery images. Upload stores images directly to S3 (when enabled) and deletion removes them.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">Upload new gallery images</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploadMutation.isPending ? 'Uploading...' : 'Select Images'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPickAndUpload(e.target.files)}
          />

          <p className="text-xs text-muted-foreground">
            Tip: upload multiple images at once. They will appear in upload order.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current gallery images</CardTitle>
          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${sortedImages.length} image(s)`}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">Loading...</div>
          ) : sortedImages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No gallery images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedImages.map((img) => (
                <div key={img.id} className="rounded-lg border border-border/60 p-3 space-y-2">
                  <div className="relative aspect-video w-full rounded-md overflow-hidden bg-muted/30">
                    <ImageWithFallback
                      src={img.image_url}
                      alt="Gallery image"
                      className="w-full h-full object-cover"
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      onClick={async () => {
                        const ok = window.confirm('Delete this gallery image?');
                        if (!ok) return;
                        try {
                          await deleteMutation.mutateAsync(img.id);
                          toast({ title: 'Gallery image deleted' });
                        } catch (e: unknown) {
                          const msg = e instanceof Error ? e.message : 'Delete failed';
                          toast({ title: 'Delete failed', description: msg, variant: 'destructive' });
                        }
                      }}
                      className="absolute top-2 right-2 inline-flex items-center gap-2 shadow"
                    >
                      <Delete className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">Order: {img.display_order}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
