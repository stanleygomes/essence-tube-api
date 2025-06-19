import { AuthRoutes } from '../web/vercel/routes/auth.route.js';
import { GetUrlConsentUseCase } from '../../domain/usecases/get-url-consent-use-case.js';
import { GetUrlRedirectBackUseCase } from '../../domain/usecases/get-url-redirect-back.js';
import { GenerateAuthTokenUseCase } from '../../domain/usecases/generate-auth-token.js';
import { TokenMongoDBRepository } from '../database/mongodb/repositories/token.repository.js';
import { CreateTokenUseCase } from '../../domain/usecases/create-token.js';
import { GetVideosFromPlaylistUseCase } from '../../domain/usecases/get-videos-from-playlist.js';
import { GetBearerTokenUseCase } from '../../domain/usecases/get-bearer-token.js';
import { SaveRefreshTokenUseCase } from '../../domain/usecases/save-refresh-token.js';
import { YoutubeService } from '../services/youtube/youtube.service.js';
import { GoogleAuthService } from '../services/google-auth/google-auth.service.js';
import { PlaylistRoutes } from '../web/vercel/routes/playlist.route.js';
import { connectMongoose } from '../database/mongodb/connection.js';
import { GetPlaylistsUseCase } from '../../domain/usecases/get-playlists.js';
import { VideoRoutes } from '../web/vercel/routes/video.route.js';
import { GetVideoUseCase } from '../../domain/usecases/get-video-use-case.js';
import { SubscriptionRoutes } from '../web/vercel/routes/subscription.route.js';
import { GetSubscribedChannelsUseCase } from '../../domain/usecases/get-subscribed-channels.js';
import { GetLatestVideosFromChannelUseCase } from '../../domain/usecases/get-latest-videos-from-channel.js';
import { AddVideoToPlaylistUseCase } from '../../domain/usecases/add-video-to-playlist.js';
import { RemoveVideoFromPlaylistUseCase } from '../../domain/usecases/remove-video-from-playlist.js';
import { GoogleAccountService } from '../services/google-account/google-account.service.js';
import { SaveUserUseCase } from '../../domain/usecases/save-user-use-case.js';
import { UserMongoDBRepository } from '../database/mongodb/repositories/user.repository.js';
import { JwtService } from '../auth/jwt.js';
import { UpdateUserUseCase } from '../../domain/usecases/update-user-use-case.js';

await connectMongoose();

/* repositories */
const tokenMongoDBRepository = new TokenMongoDBRepository();
const userMongoDBRepository = new UserMongoDBRepository();

/* services */
const googleAuthService = new GoogleAuthService();
const youtubeService = new YoutubeService();
const googleAccountService = new GoogleAccountService()
const authService = new JwtService();

/* use cases */
const updateUserUseCase = new UpdateUserUseCase(
  userMongoDBRepository,
);
const saveUserUseCase = new SaveUserUseCase(
  userMongoDBRepository,
  updateUserUseCase
);
const saveRefreshTokenUseCase = new SaveRefreshTokenUseCase(
  googleAuthService,
  tokenMongoDBRepository,
);
const getBearerTokenUseCase = new GetBearerTokenUseCase(
  saveRefreshTokenUseCase,
  tokenMongoDBRepository,
);
const createToken = new CreateTokenUseCase(
  tokenMongoDBRepository,
);
const generateAuthToken = new GenerateAuthTokenUseCase(
  googleAuthService,
  createToken,
);
const getUrlConsentUseCase = new GetUrlConsentUseCase(googleAuthService);
const getUrlRedirectBack = new GetUrlRedirectBackUseCase(
  generateAuthToken,
  googleAccountService,
  saveUserUseCase,
  authService,
);
const getVideosFromPlaylistUseCase = new GetVideosFromPlaylistUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const getPlaylistsUseCase = new GetPlaylistsUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const getVideoUseCase = new GetVideoUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const getSubscribedChannelsUseCase = new GetSubscribedChannelsUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const getLatestVideosFromChannelUseCase = new GetLatestVideosFromChannelUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const addVideoToPlaylistUseCase = new AddVideoToPlaylistUseCase(
  getBearerTokenUseCase,
  youtubeService,
);
const removeVideoFromPlaylistUseCase = new RemoveVideoFromPlaylistUseCase(
  getBearerTokenUseCase,
  youtubeService,
);

/* routes */
const authRoutes = new AuthRoutes(
  getUrlConsentUseCase,
  getUrlRedirectBack,
);
const playlistRoutes = new PlaylistRoutes(
  getVideosFromPlaylistUseCase,
  getPlaylistsUseCase,
  addVideoToPlaylistUseCase,
  removeVideoFromPlaylistUseCase,
);
const videoRoutes = new VideoRoutes(
  getVideoUseCase,
);
const subscriptionRoutes = new SubscriptionRoutes(
  getSubscribedChannelsUseCase,
  getLatestVideosFromChannelUseCase,
);

export {
  authRoutes,
  playlistRoutes,
  videoRoutes,
  subscriptionRoutes,
};
