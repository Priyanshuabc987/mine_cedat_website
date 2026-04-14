
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAllSocialPosts, type SocialPost } from "@/hooks/useSocialPosts";

const LINKEDIN_EMBED_HEIGHT = 650;
const INSTAGRAM_EMBED_HEIGHT = 610;

export function SocialFeed() {
  const { data, isLoading, error } = useAllSocialPosts();
  const posts = data || [];
  const linkedinPosts = posts.filter((post) => post.platform === "linkedin");
  const instagramPosts = posts.filter((post) => post.platform === "instagram");

  // Load LinkedIn embed script
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).IN) {
        (window as any).IN.parse();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.linkedin.com/in.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [posts]);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-4">
            Follow Us
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Stay updated with the latest from CEDAT on social media
          </p>
        </motion.div>

        {linkedinPosts.length > 0 && (
          <SocialRow
            title="LinkedIn Updates"
            posts={linkedinPosts}
            embedHeight={LINKEDIN_EMBED_HEIGHT}
          />
        )}

        {instagramPosts.length > 0 && (
          <SocialRow
            title="Instagram Highlights"
            posts={instagramPosts}
            embedHeight={INSTAGRAM_EMBED_HEIGHT}
          />
        )}
      </div>
    </section>
  );
}

function SocialRow({
  title,
  posts,
  embedHeight,
}: {
  title: string;
  posts: SocialPost[];
  embedHeight: number;
}) {
  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Scroll horizontally</p>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:thin]">
        {posts.map((post, index) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.32) }}
              viewport={{ once: true }}
              className="snap-start shrink-0 w-[98vw] sm:w-[68vw] lg:w-[calc((100%-3rem)/3)]"
            >
              <div
                className="bg-muted/40 rounded-xl p-2 sm:p-3 overflow-hidden"
                style={{ height: embedHeight + 24 }}
              >
                {post.platform === "instagram" ? (
                  <iframe
                    src={getInstagramEmbedUrl(post.post_url)}
                    height={embedHeight}
                    width="100%"
                    frameBorder="0"
                    scrolling="no"
                    allowtransparency="true"
                    title="Embedded Instagram post"
                    style={{ maxWidth: "100%", backgroundColor: "#fff" }}
                  />
                ) : (
                  <iframe
                    src={`https://www.linkedin.com/embed/feed/update/${extractLinkedInID(post.post_url)}?collapsed=1`}
                    height={embedHeight}
                    width="100%"
                    frameBorder="0"
                    allowFullScreen
                    title={`LinkedIn post by CEDAT`}
                    style={{ maxWidth: "100%" }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function extractLinkedInID(url: string): string {
  try {
    const parsed = new URL(url);
    const full = `${parsed.pathname}${parsed.search}`;
    const ugcFromPosts = full.match(/ugcPost-(\d+)/i);
    if (ugcFromPosts?.[1]) return `urn:li:ugcPost:${ugcFromPosts[1]}`;
    const activityFromPosts = full.match(/activity-(\d+)/i);
    if (activityFromPosts?.[1]) return `urn:li:activity:${activityFromPosts[1]}`;
    const feedUrn = full.match(/urn:li:(ugcPost|activity):(\d+)/i);
    if (feedUrn?.[1] && feedUrn?.[2]) return `urn:li:${feedUrn[1]}:${feedUrn[2]}`;
  } catch {}
  const ugcFallback = url.match(/ugcPost-(\d+)/i);
  if (ugcFallback?.[1]) return `urn:li:ugcPost:${ugcFallback[1]}`;
  const activityFallback = url.match(/activity-(\d+)/i);
  if (activityFallback?.[1]) return `urn:li:activity:${activityFallback[1]}`;
  return url;
}

function getInstagramEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/(p|reel|tv)\/([^/?#]+)/i);
    if (match?.[1] && match?.[2]) {
      const type = match[1].toLowerCase();
      const code = match[2];
      return `https://www.instagram.com/${type}/${code}/embed/`;
    }
  } catch {}
  return url;
}
