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

  return (data.items || []).map(mapPlaylistItem);
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

  return (data.items || []).map(mapVideoItem);
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
