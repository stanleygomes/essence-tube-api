const axios = require('axios');
import { config } from '../config/config';
import { logger } from '../utils/logger';

const { apiBaseUrl, watchLaterPlaylistId } = config.services.youtube;

export async function getPlaylistVideos(token, playlistId, maxResults = 50) {
  const data = await youtubeApiRequest({
    token,
    endpoint: 'playlistItems',
    method: 'GET',
    params: {
      part: 'snippet,contentDetails',
      maxResults,
      playlistId,
    },
  });

  return data.items;
}

export async function getPlaylistItems(token, maxResults = 50) {
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



