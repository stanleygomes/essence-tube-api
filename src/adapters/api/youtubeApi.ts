import axios from 'axios';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';

const { apiBaseUrl } = config.services.youtube;

interface YoutubeApiRequestParams {
  token: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'DELETE';
  params?: Record<string, any>;
  data?: any;
}

interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres: string;
  };
}

interface VideoItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres: string;
  };
  owner: {
    id: string;
    title: string;
  };
  videoPublishedAt: string;
}

interface ChannelItem {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

interface LatestVideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres: string;
  };
  channelId: string;
  channelTitle: string;
}

interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  statistics: Record<string, any>;
  contentDetails: Record<string, any>;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres: string;
  };
}

export async function getPlaylistList(token: string, maxResults = 50): Promise<PlaylistItem[]> {
  const data = await youtubeApiRequest({
    token,
    endpoint: 'playlists',
    method: 'GET',
    params: {
      part: 'snippet,contentDetails',
      maxResults,
      mine: true,
    },
  });

  return (data.items || [])
    .map(mapPlaylistItem)
    .sort((a: PlaylistItem, b: PlaylistItem) => a.title.localeCompare(b.title));
}

export async function getPlaylistItems(token: string, playlistId: string, maxResults = 50): Promise<VideoItem[]> {
  if (!playlistId) {
    throw new Error("playlistId is required!");
  }

  const data = await youtubeApiRequest({
    token,
    endpoint: 'playlistItems',
    method: 'GET',
    params: {
      part: 'snippet,contentDetails',
      maxResults,
      playlistId,
      mine: true,
    },
  });

  return (data.items || [])
    .sort((a: any, b: any) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime())
    .map(mapVideoItem);
}

export async function getVideoMetadata(token: string, videoId: string): Promise<VideoMetadata | null> {
  if (!videoId) {
    throw new Error("videoId is required!");
  }

  const data = await youtubeApiRequest({
    token,
    endpoint: 'videos',
    method: 'GET',
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoId,
    },
  });

  return data.items && data.items.length > 0 ? mapVideoMetadata(data.items[0]) : null;
}

export async function removeVideoFromPlaylist(token: string, playlistItemId: string): Promise<any> {
  if (!playlistItemId) {
    throw new Error("playlistItemId is required!");
  }

  const response = await youtubeApiRequest({
    token,
    endpoint: 'playlistItems',
    method: 'DELETE',
    params: {
      id: playlistItemId,
    },
  });

  return response;
}

export async function getSubscribedChannels(token: string, maxResults = 50): Promise<ChannelItem[]> {
  const data = await youtubeApiRequest({
    token,
    endpoint: 'subscriptions',
    method: 'GET',
    params: {
      part: 'snippet,contentDetails',
      mine: true,
      maxResults,
    },
  });

  return (data.items || [])
    .map(mapChannelItem)
    .sort((a: ChannelItem, b: ChannelItem) => a.title.localeCompare(b.title));
}

export async function getLatestVideosFromChannel(token: string, channelId: string, maxResults = 10): Promise<LatestVideoItem[]> {
  if (!channelId) {
    throw new Error("channelId is required!");
  }

  const data = await youtubeApiRequest({
    token,
    endpoint: 'search',
    method: 'GET',
    params: {
      part: 'snippet',
      channelId,
      order: 'date',
      maxResults,
      type: 'video',
    },
  });

  return (data.items || []).map(mapLatestVideoItem);
}

export async function addVideoToPlaylist(token: string, playlistId: string, videoId: string): Promise<any> {
  if (!playlistId || !videoId) {
    throw new Error("playlistId e videoId are required!");
  }

  const data = {
    snippet: {
      playlistId,
      resourceId: {
        kind: "youtube#video",
        videoId,
      },
    },
  };

  const response = await youtubeApiRequest({
    token,
    endpoint: 'playlistItems',
    method: 'POST',
    params: {
      part: 'snippet',
    },
    data,
  });

  return response;
}

function buildHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

async function youtubeApiRequest({
  token,
  endpoint,
  method = 'GET',
  params = {},
  data = null,
}: YoutubeApiRequestParams): Promise<any> {
  try {
    const res = await axios({
      url: `${apiBaseUrl}/${endpoint}`,
      method,
      headers: buildHeaders(token),
      params,
      data,
    });
    return res.data;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
}

function mapPlaylistItem(item: any): PlaylistItem {
  return {
    id: item.id,
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    thumbnails: {
      default: item.snippet?.thumbnails?.default?.url || "",
      medium: item.snippet?.thumbnails?.medium?.url || "",
      high: item.snippet?.thumbnails?.high?.url || "",
      maxres: item.snippet?.thumbnails?.maxres?.url || "",
    },
  };
}

function mapVideoItem(item: any): VideoItem {
  return {
    id: item.id,
    videoId: item.snippet?.resourceId?.videoId || "",
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    thumbnails: {
      default: item.snippet?.thumbnails?.default?.url || "",
      medium: item.snippet?.thumbnails?.medium?.url || "",
      high: item.snippet?.thumbnails?.high?.url || "",
      maxres: item.snippet?.thumbnails?.maxres?.url || "",
    },
    owner: {
      id: item.snippet?.videoOwnerChannelId || "",
      title: item.snippet?.videoOwnerChannelTitle || "",
    },
    videoPublishedAt: item.contentDetails?.videoPublishedAt || "",
  };
}

function mapVideoMetadata(item: any): VideoMetadata {
  return {
    id: item.id,
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    statistics: item.statistics || {},
    contentDetails: item.contentDetails || {},
    thumbnails: {
      default: item.snippet?.thumbnails?.default?.url || "",
      medium: item.snippet?.thumbnails?.medium?.url || "",
      high: item.snippet?.thumbnails?.high?.url || "",
      maxres: item.snippet?.thumbnails?.maxres?.url || "",
    },
  };
}

function mapChannelItem(item: any): ChannelItem {
  return {
    id: item.snippet?.resourceId?.channelId || "",
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    thumbnails: {
      default: item.snippet?.thumbnails?.default?.url || "",
      medium: item.snippet?.thumbnails?.medium?.url || "",
      high: item.snippet?.thumbnails?.high?.url || "",
    },
  };
}

function mapLatestVideoItem(item: any): LatestVideoItem {
  return {
    id: item.id.videoId,
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    publishedAt: item.snippet?.publishedAt,
    thumbnails: {
      default: item.snippet?.thumbnails?.default?.url || "",
      medium: item.snippet?.thumbnails?.medium?.url || "",
      high: item.snippet?.thumbnails?.high?.url || "",
      maxres: item.snippet?.thumbnails?.maxres?.url || "",
    },
    channelId: item.snippet?.channelId,
    channelTitle: item.snippet?.channelTitle,
  };
}
