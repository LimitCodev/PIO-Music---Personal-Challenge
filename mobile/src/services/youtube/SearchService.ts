// mobile/src/services/youtube/SearchService.ts
export class YouTubeSearchService {
  private laptopIP = 'http://192.168.1.100:3000'; // Tu laptop en red local

  async search(query: string): Promise<SearchResult[]> {
    // Usar tu laptop como backend
    const response = await fetch(`${this.laptopIP}/search?q=${encodeURIComponent(query)}`);
    const results = await response.json();
    return results;
  }

  async getVideoInfo(videoId: string): Promise<VideoInfo> {
    const response = await fetch(`${this.laptopIP}/info/${videoId}`);
    return await response.json();
  }
}

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
}