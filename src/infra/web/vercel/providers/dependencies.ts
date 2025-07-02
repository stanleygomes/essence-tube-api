import { AuthRoutes } from '../routes/auth.route.js';
import { GetUrlConsentUseCase } from '../../../../application/usecases/get-url-consent-use-case.js';
import { GetUrlRedirectBackUseCase } from '../../../../application/usecases/get-url-redirect-back.js';
import { GenerateAuthTokenUseCase } from '../../../../application/usecases/generate-auth-token.js';
import { TokenMongoDBRepository } from '../../../database/mongodb/repositories/token.repository.js';
import { CreateTokenUseCase } from '../../../../application/usecases/create-token.js';
import { GetVideosFromPlaylistUseCase } from '../../../../application/usecases/get-videos-from-playlist.js';
import { GetPartnerBearerTokenUseCase } from '../../../../application/usecases/get-bearer-token.js';
import { SaveRefreshTokenUseCase } from '../../../../application/usecases/save-refresh-token.js';
import { YoutubeService } from '../../../services/youtube/youtube.service.js';
import { GoogleAuthService } from '../../../services/google-auth/google-auth.service.js';
import { PlaylistRoutes } from '../routes/playlist.route.js';
import { connectMongoose } from '../../../database/mongodb/connection.js';
import { GetPlaylistsUseCase } from '../../../../application/usecases/get-playlists.js';
import { VideoRoutes } from '../routes/video.route.js';
import { GetVideoUseCase } from '../../../../application/usecases/get-video-use-case.js';
import { SubscriptionRoutes } from '../routes/subscription.route.js';
import { GetSubscribedChannelsUseCase } from '../../../../application/usecases/get-subscribed-channels.js';
import { GetLatestVideosFromChannelUseCase } from '../../../../application/usecases/get-latest-videos-from-channel.js';
import { AddVideoToPlaylistUseCase } from '../../../../application/usecases/add-video-to-playlist.js';
import { RemoveVideoFromPlaylistUseCase } from '../../../../application/usecases/remove-video-from-playlist.js';
import { GoogleAccountService } from '../../../services/google-account/google-account.service.js';
import { SaveUserUseCase } from '../../../../application/usecases/save-user-use-case.js';
import { UserMongoDBRepository } from '../../../database/mongodb/repositories/user.repository.js';
import { JwtService } from '../../../auth/jwt.js';
import { UpdateUserUseCase } from '../../../../application/usecases/update-user-use-case.js';

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
const getPartnerBearerTokenUseCase = new GetPartnerBearerTokenUseCase(
  saveRefreshTokenUseCase,
  tokenMongoDBRepository,
  authService,
  userMongoDBRepository,
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
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const getPlaylistsUseCase = new GetPlaylistsUseCase(
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const getVideoUseCase = new GetVideoUseCase(
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const getSubscribedChannelsUseCase = new GetSubscribedChannelsUseCase(
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const getLatestVideosFromChannelUseCase = new GetLatestVideosFromChannelUseCase(
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const addVideoToPlaylistUseCase = new AddVideoToPlaylistUseCase(
  getPartnerBearerTokenUseCase,
  youtubeService,
);
const removeVideoFromPlaylistUseCase = new RemoveVideoFromPlaylistUseCase(
  getPartnerBearerTokenUseCase,
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
