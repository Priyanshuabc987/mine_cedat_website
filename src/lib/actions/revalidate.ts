
'use server';

import { revalidateTag } from 'next/cache';

/**
 * Revalidates the cache for the list of all events.
 * Call this when a new event is created or any event's list-facing data changes.
 */
export async function revalidateEventsList() {
  revalidateTag('events');
}

/**
 * Revalidates the cache for a single event's detail page.
 * Call this when a specific event is updated or deleted.
 * @param eventId The ID of the specific event to revalidate.
 */
export async function revalidateEventDetail(eventId: string) {
  revalidateTag(`event:${eventId}`);
}

/**
 * Revalidates the cache for the social posts feed on the home page.
 * Call this when posts are added, deleted, or reordered.
 */
export async function revalidateSocialPosts() {
  revalidateTag('social-posts');
}
