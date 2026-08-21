import { VIDEOS } from "./data";
import { fetchLatestVideos } from "./rss";
import type { VideoItem } from "./data";

/**
 * Videos shown on the site: live RSS entries when the feed is reachable
 * at build/revalidate time, otherwise the curated fallback list.
 */
export async function getVideos(): Promise<VideoItem[]> {
  const live = await fetchLatestVideos();
  if (live && live.length > 0) {
    return live;
  }
  return VIDEOS;
}
