// filepath: /home/stanley/Downloads/projects/essence-tube-api/src/infra/web/fastify/server.ts
import Fastify from 'fastify';
import { playlistRoutes, videoRoutes, subscriptionRoutes, authRoutes } from '../../providers/dependencies.js';

const fastify = Fastify();

fastify.get('/login', (req, reply) => authRoutes.getUrlConsent(req, reply));
// fastify.get('/oauthcode', async (req, reply) => authRoutes.getUrlRedirectBack(req, reply));
// fastify.get('/playlists', (req, reply) => playlistRoutes.getPlaylists(req, reply));
// fastify.get('/playlists/:id', (req, reply) => playlistRoutes.getVideosFromPlaylist(req, reply));

fastify.listen({ port: 3000 }, err => {
  if (err) throw err;
  console.log('Fastify server running on http://localhost:3000');
});
