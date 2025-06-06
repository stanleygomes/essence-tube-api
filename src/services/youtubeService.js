const axios = require('axios');
import { config } from '../config/config';

const googleConfig = config.services.google;

export async function getGoogleToken(authCode) {
  try {
    const res = await axios.post(googleConfig.apiAuthUrl, null, {
      params: {
        code: authCode,
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        redirect_uri: googleConfig.redirectUri,
        grant_type: 'authorization_code'
      }
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Google token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Google token error: ${error.message}`);
    }
  }
}

export function buildUrlConsentGoogle() {
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleConfig.clientId}` +
    `&redirect_uri=${googleConfig.redirectUri}` +
    `&response_type=code` +
    `&scope=${googleConfig.scope}` +
    `&access_type=offline` +
    `&prompt=consent`;
}

// const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
// const WATCH_LATER_PLAYLIST_ID = 'WL'; // "Watch Later" playlist ID padrão

// // Helper para autenticação
// function getAuthHeaders(token) {
//   return {
//     Authorization: `Bearer ${token}`,
//     Accept: 'application/json',
//   };
// }

// // 1. Buscar lista de vídeos da playlist "Watch Later"
// async function getPlaylistVideos(token, playlistId = WATCH_LATER_PLAYLIST_ID) {
//   const res = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
//     headers: getAuthHeaders(token),
//     params: {
//       part: 'snippet,contentDetails',
//       maxResults: 50,
//       playlistId,
//     },
//   });
//   return res.data.items;
// }

// // 2. Buscar metadados de um vídeo pelo ID
// async function getVideoById(apiKey, videoId) {
//   const res = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
//     params: {
//       part: 'snippet,contentDetails,statistics',
//       id: videoId,
//       key: apiKey,
//     },
//   });
//   return res.data.items[0];
// }

// // 3. Adicionar vídeo à playlist "Watch Later"
// async function addVideoToWatchLater(token, videoId, playlistId = WATCH_LATER_PLAYLIST_ID) {
//   const res = await axios.post(
//     `${YOUTUBE_API_BASE}/playlistItems?part=snippet`,
//     {
//       snippet: {
//         playlistId,
//         resourceId: {
//           kind: 'youtube#video',
//           videoId,
//         },
//       },
//     },
//     { headers: getAuthHeaders(token) }
//   );
//   return res.data;
// }

// // 4. Remover vídeo da playlist "Watch Later"
// async function removeVideoFromWatchLater(token, playlistItemId) {
//   // playlistItemId é o ID do item na playlist, não do vídeo!
//   const res = await axios.delete(
//     `${YOUTUBE_API_BASE}/playlistItems`,
//     {
//       headers: getAuthHeaders(token),
//       params: { id: playlistItemId },
//     }
//   );
//   return res.data;
// }

// // 5. Listar canais inscritos
// async function listSubscribedChannels(token) {
//   const res = await axios.get(`${YOUTUBE_API_BASE}/subscriptions`, {
//     headers: getAuthHeaders(token),
//     params: {
//       part: 'snippet',
//       mine: true,
//       maxResults: 50,
//     },
//   });
//   return res.data.items;
// }

// // 6. Listar últimos vídeos dos canais inscritos
// async function listLatestVideosFromSubscriptions(token) {
//   const channels = await listSubscribedChannels(token);
//   const uploadsPromises = channels.map(async (sub) => {
//     const channelId = sub.snippet.resourceId.channelId;
//     // Buscar uploads playlist do canal
//     const channelRes = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
//       headers: getAuthHeaders(token),
//       params: {
//         part: 'contentDetails',
//         id: channelId,
//       },
//     });
//     const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;
//     // Buscar últimos vídeos da playlist de uploads
//     const videosRes = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
//       headers: getAuthHeaders(token),
//       params: {
//         part: 'snippet,contentDetails',
//         playlistId: uploadsPlaylistId,
//         maxResults: 5,
//       },
//     });
//     return {
//       channelId,
//       channelTitle: sub.snippet.title,
//       videos: videosRes.data.items,
//     };
//   });
//   return Promise.all(uploadsPromises);
// }

// module.exports = {
//   getPlaylistVideos,
//   getVideoById,
//   addVideoToWatchLater,
//   removeVideoFromWatchLater,
//   listSubscribedChannels,
//   listLatestVideosFromSubscriptions,
// };
