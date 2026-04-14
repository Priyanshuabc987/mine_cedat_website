import { useState } from 'react';
import { useSocialPosts, useAddSocialPost, useDeleteSocialPost } from '@/hooks/useSocialPosts';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Delete, Plus, ExternalLink, Loader2 } from 'lucide-react';

export function SocialPostManagement() {
  const { toast } = useToast();
  const { data: posts, isLoading } = useSocialPosts();
  const addMutation = useAddSocialPost();
  const deleteMutation = useDeleteSocialPost();

  const [postUrl, setPostUrl] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'linkedin'>('instagram');

  const handleAddPost = async () => {
    if (!postUrl.trim()) {
      toast({ title: 'Error', description: 'Please enter a post URL', variant: 'destructive' });
      return;
    }

    try {
      await addMutation.mutateAsync({ post_url: postUrl, platform });
      toast({ title: 'Success', description: 'Social post added!' });
      setPostUrl('');
      setPlatform('instagram');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to add post';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Success', description: 'Social post deleted!' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete post';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2 break-words">Social Media Posts</h1>
        <p className="text-sm sm:text-base text-muted-foreground break-words">
          Add Instagram and LinkedIn post links to display on the home page. Posts will be embedded automatically.
        </p>
      </div>

      {/* Add New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Social Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as 'instagram' | 'linkedin')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Post URL</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="e.g., https://www.instagram.com/p/ABC123/"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAddPost}
                disabled={addMutation.isPending}
                className="w-full sm:w-auto"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Post
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {platform === 'instagram'
                ? 'Paste the full Instagram post URL (https://www.instagram.com/p/...)'
                : 'Paste the full LinkedIn post URL or share link'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Added Posts ({posts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-border/50 bg-card/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                        {post.platform}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm break-all text-muted-foreground line-clamp-1">{post.post_url}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      <Delete className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No social posts added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
