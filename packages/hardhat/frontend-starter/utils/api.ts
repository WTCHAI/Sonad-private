// API utilities for fetching Twitter data and backend integration
import { TwitterPost } from "../types/twitter";

// Mock API functions - replace with your actual backend calls
export class SonadAPI {
  private static BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Fetch Twitter posts with $MONAD or $NAD hashtags
  static async fetchTwitterPosts(): Promise<TwitterPost[]> {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`${this.BASE_URL}/api/posts?page=${page}&limit=${limit}`);
      // const data = await response.json();
      // return data.posts;

      // Mock data for now
      return [
        {
          id: "1967419837006901294",
          author_id: "1704079725839495168",
          text: "Gm🌟 Gmonad💜\n\nSay it back🪻 #MONAD #NAD",
          created_at: "2025-09-20T02:00:57.349Z",
          retweet_count: 24,
          reply_count: 679,
          like_count: 1173,
          quote_count: 4,
          bookmark_count: 22,
          impression_count: 22430,
          fetched_at: "2025-09-20T02:00:57.349Z",
          updated_at: "2025-09-20T02:00:57.349Z",
          username: "1Cilineth",
          name: "Cilin (mainnet arc)",
          profile_image_url: "https://pbs.twimg.com/profile_images/1933135848851283968/bzBh7Biv_normal.jpg",
          media: [
            {
              media_key: "3_1967419825015406592",
              type: "photo",
              url: "https://pbs.twimg.com/media/G02t6DIawAAdZZm.jpg",
              preview_image_url: null,
              width: 2684,
              height: 3205,
            },
          ],
        },
      ];
    } catch (error) {
      console.error("Failed to fetch Twitter posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  // Submit post for verification
  static async submitForVerification(tweetId: string, creatorAddress: string): Promise<boolean> {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`${this.BASE_URL}/api/verify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tweetId, creatorAddress })
      // });
      // return response.ok;

      console.log(`Submitting tweet ${tweetId} for verification by ${creatorAddress}`);
      return true; // Mock success
    } catch (error) {
      console.error("Failed to submit for verification:", error);
      return false;
    }
  }

  // Get post analytics
  static async getPostAnalytics() {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`${this.BASE_URL}/api/analytics/${tweetId}`);
      // return await response.json();

      return {
        totalVotes: 45,
        litPercentage: 78,
        totalTips: "245",
        uniqueVoters: 23,
        engagement: "high",
      }; // Mock analytics
    } catch (error) {
      console.error("Failed to get analytics:", error);
      return null;
    }
  }

  // Report content
  static async reportPost(tweetId: string, reason: string): Promise<boolean> {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`${this.BASE_URL}/api/report`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tweetId, reason, reporterAddress })
      // });
      // return response.ok;

      console.log(`Reporting tweet ${tweetId} for: ${reason}`);
      return true; // Mock success
    } catch (error) {
      console.error("Failed to report post:", error);
      return false;
    }
  }
}

// Utility functions for API integration
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const retryApiCall = async <T>(apiCall: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error("Max retries exceeded");
};

// Cache utilities
class APICache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static set(key: string, data: any, ttlMs = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static clear(): void {
    this.cache.clear();
  }
}

export { APICache };
