
import { useMemo, useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useDeleteGalleryImage, useGalleryImages, useUpdateGalleryOrder, useUploadGalleryImages } from '@/hooks/useGallery';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Delete, Upload, GripVertical, Loader2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GalleryItem } from '@/lib/types';

function DraggableGridItem({ item, index, onDelete }: { item: GalleryItem; index: number; onDelete: () => void; }) {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          // Centers the 50% width box within the grid column
          className="w-full md:w-[calc(33.33%-1rem)] justify-center py-2 group"
        >
          {/* w-1/2 + aspect-square = 50% width and 50% height of the parent width */}
          <div className={`relative w-[70%] aspect-[7/5] rounded-lg overflow-hidden border-2 transition-all ${
            snapshot.isDragging ? 'border-primary shadow-2xl scale-110 z-50' : 'border-transparent'
          }`}>
            <ImageWithFallback
              src={item.url}
              alt={item.caption || `Gallery item ${index + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Smaller index badge for the smaller image */}
            <span className="absolute bottom-1 left-2 text-white font-bold text-sm drop-shadow-md">
              {index + 1}
            </span>

            {/* Delete Button - Scaled down */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents drag triggers on click
                    onDelete();
                  }} 
                  className="h-6 w-6"
                >
                  <Delete className="h-3 w-3" />
                </Button>
            </div>

            {/* Drag Handle - Scaled down */}
            <div 
              {...provided.dragHandleProps} 
              className="absolute top-1 left-1 cursor-grab p-1 rounded-md bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-foreground/80" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}


export function GalleryManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');

  const { data: allItems, isLoading } = useGalleryImages();
  const uploadMutation = useUploadGalleryImages();
  const deleteMutation = useDeleteGalleryImage();
  const updateOrderMutation = useUpdateGalleryOrder();

  const sortedPhotos = useMemo(() => allItems?.filter(it => it.type === 'photo').sort((a, b) => a.display_order - b.display_order) ?? [], [allItems]);
  const sortedVideos = useMemo(() => allItems?.filter(it => it.type === 'video').sort((a, b) => a.display_order - b.display_order) ?? [], [allItems]);

  const [orderedPhotos, setOrderedPhotos] = useState<GalleryItem[]>([]);
  const [orderedVideos, setOrderedVideos] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setOrderedPhotos(sortedPhotos);
    setOrderedVideos(sortedVideos);
  }, [sortedPhotos, sortedVideos]);

  const isOrderChanged = useMemo(() => {
    const photosChanged = JSON.stringify(sortedPhotos.map(p => p.id)) !== JSON.stringify(orderedPhotos.map(p => p.id));
    const videosChanged = JSON.stringify(sortedVideos.map(v => v.id)) !== JSON.stringify(orderedVideos.map(v => v.id));
    return photosChanged || videosChanged;
  }, [sortedPhotos, sortedVideos, orderedPhotos, orderedVideos]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ title: 'No file selected', description: 'Please choose a file to upload.', variant: 'destructive' });
      return;
    }
    uploadMutation.mutate({ file, type: uploadType }, {
        onSuccess: () => toast({ title: 'Upload Successful', description: `Your ${uploadType} has been added.` })
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (item: GalleryItem) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      deleteMutation.mutate({ id: item.id, url: item.url, type: item.type }, {
          onSuccess: () => toast({ title: 'Item Deleted', description: `The ${item.type} has been removed.` })
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || source.droppableId !== destination.droppableId) {
      return;
    }
    
    const droppableId = destination.droppableId;

    const listToUpdate = droppableId === 'photos' ? orderedPhotos : orderedVideos;
    const listUpdater = droppableId === 'photos' ? setOrderedPhotos : setOrderedVideos;

    const items = Array.from(listToUpdate);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    listUpdater(items);
  };

  const handleSaveOrder = () => {
    const combinedOrderedIds = [...orderedPhotos, ...orderedVideos].map(item => item.id);
    updateOrderMutation.mutate(combinedOrderedIds, {
        onSuccess: () => toast({ title: 'Order Saved', description: 'The new gallery order has been applied.' })
    });
  };  

  const handleCancelOrder = () => {
    setOrderedPhotos(sortedPhotos);
    setOrderedVideos(sortedVideos);
    toast({ title: 'Order Reset', description: 'The display order has been reset.' });
  };

  const DroppableGridSection = ({ type, items }: { type: 'photos' | 'videos', items: GalleryItem[] }) => (
    <div className="pt-6 mt-6 border-t">
        <h3 className="text-xl font-semibold mb-4 capitalize">Manage {type}</h3>
        {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No {type} found.</p>
        ) : (
            <Droppable droppableId={type} direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-4 gap-4 px-auto">
                  {items.map((item, index) => (
                      <DraggableGridItem key={item.id} item={item} index={index} onDelete={() => handleDelete(item)} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
        )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader><CardTitle>Upload New Gallery Item</CardTitle></CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
              <Input type="file" ref={fileInputRef} className="max-w-xs" />
              <Select value={uploadType} onValueChange={(value: 'photo' | 'video') => setUploadType(value)}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
              </Select>
              <Button onClick={handleFileUpload} disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload
              </Button>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery</CardTitle>
          <CardDescription>Drag and drop items within each section to reorder them visually.</CardDescription>
        </CardHeader>
        <CardContent>
          {isOrderChanged && (
            <div className="flex justify-start items-center gap-4 p-4 rounded-md bg-secondary mb-4 sticky top-16 z-10">
                <p className="text-sm font-medium">You have unsaved changes.</p>
                <Button size="sm" onClick={handleSaveOrder} disabled={updateOrderMutation.isPending}>
                    {updateOrderMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Order
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelOrder} disabled={updateOrderMutation.isPending}>Cancel</Button>
            </div>
          )}

          {isLoading ? <p>Loading gallery...</p> : (
            <DragDropContext onDragEnd={onDragEnd}>
                <DroppableGridSection type="photos" items={orderedPhotos} />
                <DroppableGridSection type="videos" items={orderedVideos} />
            </DragDropContext>
          )}

          {!isLoading && allItems?.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
                <p className="text-muted-foreground">No gallery items found. Upload an item to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
