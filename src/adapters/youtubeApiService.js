const axios = require('axios');
import { config } from '../config/config';
import { logger } from '../utils/logger';

const { apiBaseUrl } = config.services.youtube;

export async function getPlaylistList(token, maxResults = 50) {
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
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getPlaylistItems(token, playlistId, maxResults = 50) {
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
    .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))
    .map(mapVideoItem);
}

export async function getVideoMetadata(token, videoId) {
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

export async function removeVideoFromPlaylist(token, playlistItemId) {
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

export async function getSubscribedChannels(token, maxResults = 50) {
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
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getLatestVideosFromChannel(token, channelId, maxResults = 10) {
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

export async function addVideoToPlaylist(token, playlistId, videoId) {
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

function buildHeaders(token) {
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
}) {
  try {
    const res = await axios({
      url: `${apiBaseUrl}/${endpoint}`,
      method,
      headers: buildHeaders(token),
      params,
      data,
    });
    return res.data;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

function mapPlaylistItem(item) {
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

function mapVideoItem(item) {
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
    videoId: item.contentDetails?.videoId || "",
    videoPublishedAt: item.contentDetails?.videoPublishedAt || "",
  };
}

function mapVideoMetadata(item) {
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

function mapChannelItem(item) {
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

function mapLatestVideoItem(item) {
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
