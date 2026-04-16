
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SocialPost } from "@/lib/data/socialposts"; // 1. IMPORT THE TYPE

const LINKEDIN_EMBED_HEIGHT = 620;
const INSTAGRAM_EMBED_HEIGHT = 610;

// 2. DEFINE THE PROPS FOR THE COMPONENT
interface SocialFeedProps {
  initialPosts: SocialPost[];
}

export function SocialFeed({ initialPosts }: SocialFeedProps) {
  // 3. REMOVE THE useQuery HOOK
  const posts = initialPosts || [];
  const linkedinPosts = posts.filter((post) => post.platform === "linkedin");
  const instagramPosts = posts.filter((post) => post.platform === "instagram");

  // This useEffect is for dynamically loading LinkedIn's script, which is fine to keep.
  useEffect(() => {
    if (typeof window !== 'undefined' && linkedinPosts.length > 0) {
      if ((window as any).IN) {
        (window as any).IN.parse();
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.linkedin.com/in.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, [linkedinPosts]);

  // 4. REMOVE THE LOADING STATE

  // 5. If there are no posts, render nothing.
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Follow Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            Stay updated with the latest from CEDAT on social media.
          </p>
        </motion.div>

        {linkedinPosts.length > 0 && (
          <SocialRow
            title="LinkedIn Updates"
            posts={linkedinPosts}
            platform="linkedin"
          />
        )}

        {instagramPosts.length > 0 && (
          <SocialRow
            title="Instagram Highlights"
            posts={instagramPosts}
            platform="instagram"
          />
        )}
      </div>
    </section>
  );
}

function SocialRow({
  title,
  posts,
  platform,
}: {
  title: string;
  posts: SocialPost[];
  platform: "linkedin" | "instagram";
}) {
    
  const cardBgClass = platform === 'linkedin'
    ? 'bg-[#0A66C2]'
    : 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]';
    
  const embedHeight = platform === 'linkedin' ? LINKEDIN_EMBED_HEIGHT : INSTAGRAM_EMBED_HEIGHT;

  return (
    <div className="mb-10 sm:mb-14 last:mb-0">
      <div className="flex items-end justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Scroll horizontally</p>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 -mx-2 px-4 snap-x snap-mandatory [scrollbar-width:thin]">
        {posts.map((post, index) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.32) }}
              viewport={{ once: true }}
              className={`snap-start shrink-0 w-[105vw] sm:w-[68vw] md:w-[400px] rounded-2xl p-2 sm:p-3 overflow-hidden shadow-lg ${cardBgClass}`}
            >
                <div 
                  className="bg-background rounded-lg overflow-hidden"
                  style={{ height: embedHeight }}
                >
                  {platform === "instagram" ? (
                      <iframe
                        src={getInstagramEmbedUrl(post.post_url)}
                        height={embedHeight}
                        width="100%"
                        frameBorder="0"
                        scrolling="no"
                        title={`Embedded Instagram post: ${post.id}`}
                        className="w-full border-none"
                      />
                  ) : (
                      <iframe
                        src={`https://www.linkedin.com/embed/feed/update/${extractLinkedInID(post.post_url)}?collapsed=1`}
                        height={embedHeight}
                        width="100%"
                        frameBorder="0"
                        allowFullScreen
                        title={`LinkedIn post by CEDAT: ${post.id}`}
                        className="w-full border-none"
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

// --- Utility Functions ---

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
      return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/`;
    }
  } catch {}
  return url.includes('/embed') ? url : `${url.split('?')[0]}embed`;
}
