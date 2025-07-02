import { FastifyInstance } from 'fastify';
import { AuthRoutes } from './routes/auth.route.js';
import {
  addVideoToPlaylistUseCase,
  getPlaylistsUseCase,
  getUrlConsentUseCase,
  getUrlRedirectBackUseCase,
  getVideosFromPlaylistUseCase,
  removeVideoFromPlaylistUseCase,
  getSubscribedChannelsUseCase,
  getLatestVideosFromChannelUseCase,
  getVideoUseCase,
} from '../../providers/dependencies.js';
import { PlaylistRoutes } from './routes/playlist.route.js';
import { SubscriptionRoutes } from './routes/subscription.route.js';
import { VideoRoutes } from './routes/video.route.js';

export class AppRouter {
  private authRoutes: AuthRoutes;
  private playlistRoutes: PlaylistRoutes;
  private subscriptionRoutes: SubscriptionRoutes;
  private videoRoutes: VideoRoutes;

  constructor() {
    this.authRoutes = new AuthRoutes(
      getUrlConsentUseCase,
      getUrlRedirectBackUseCase
    );

    this.playlistRoutes = new PlaylistRoutes(
      getVideosFromPlaylistUseCase,
      getPlaylistsUseCase,
      addVideoToPlaylistUseCase,
      removeVideoFromPlaylistUseCase,
    );

    this.subscriptionRoutes = new SubscriptionRoutes(
      getSubscribedChannelsUseCase,
      getLatestVideosFromChannelUseCase,
    );

    this.videoRoutes = new VideoRoutes(getVideoUseCase);
  }

  public register(fastify: FastifyInstance, prefix = '') {
    // Auth routes
    fastify.get(`${prefix}/login`, {
      schema: {
        description: 'Login with Google',
        tags: ['Auth'],
        response: {
          302: {
            description: 'Redirect to Google OAuth',
            type: 'null'
          }
        }
      }
    }, this.authRoutes.getUrlConsentHandler);

    fastify.get(`${prefix}/oauthcode`, {
      schema: {
        description: 'Callback do OAuth do Google',
        tags: ['Auth'],
        response: {
          200: {
            description: 'Código de autorização recebido',
            type: 'object'
          }
        }
      }
    }, this.authRoutes.getUrlRedirectBackHandler);

    // Playlist routes
    fastify.get(`${prefix}/playlists`, {
      schema: {
        description: 'Lista todas as playlists do usuário',
        tags: ['Playlist'],
        response: {
          200: {
            description: 'Lista de playlists',
            type: 'array',
            items: { type: 'object' }
          }
        }
      }
    }, this.playlistRoutes.getPlaylistsHandler);

    fastify.get(`${prefix}/playlists/:id`, {
      schema: {
        description: 'Lista vídeos de uma playlist',
        tags: ['Playlist'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID da playlist' }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Lista de vídeos',
            type: 'array',
            items: { type: 'object' }
          }
        }
      }
    }, this.playlistRoutes.getVideosFromPlaylistHandler);

    fastify.post(`${prefix}/playlists/video`, {
      schema: {
        description: 'Adiciona um vídeo a uma playlist',
        tags: ['Playlist'],
        querystring: {
          type: 'object',
          properties: {
            playlistId: { type: 'string' },
            videoId: { type: 'string' }
          },
          required: ['playlistId', 'videoId']
        },
        response: {
          200: {
            description: 'Vídeo adicionado',
            type: 'object'
          }
        }
      }
    }, this.playlistRoutes.addPlaylistVideoHandler);

    fastify.delete(`${prefix}/playlists/video`, {
      schema: {
        description: 'Remove um vídeo de uma playlist',
        tags: ['Playlist'],
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Vídeo removido',
            type: 'string'
          }
        }
      }
    }, this.playlistRoutes.removePlaylistVideoHandler);

    // Subscription routes
    fastify.get(`${prefix}/subscriptions`, {
      schema: {
        description: 'Lista canais inscritos',
        tags: ['Subscription'],
        response: {
          200: {
            description: 'Lista de canais',
            type: 'array',
            items: { type: 'object' }
          }
        }
      }
    }, this.subscriptionRoutes.getChannelsHandler);

    fastify.get(`${prefix}/subscriptions/:id/videos`, {
      schema: {
        description: 'Lista últimos vídeos de um canal',
        tags: ['Subscription'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID do canal' }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Lista de vídeos',
            type: 'array',
            items: { type: 'object' }
          }
        }
      }
    }, this.subscriptionRoutes.getLatestVideosFromChannelHandler);

    // Video routes
    fastify.get(`${prefix}/videos/:id`, {
      schema: {
        description: 'Busca dados de um vídeo',
        tags: ['Video'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'ID do vídeo' }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Dados do vídeo',
            type: 'object'
          }
        }
      }
    }, this.videoRoutes.getVideoHandler);
  }
}
