const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
  APP_PUBLIC_BASE_URL,
  MONGODB_URI,
  MONGODB_DATABASE,
  APP_CORS_ORIGIN,
} = process.env;

export const config = {
  app: {
    web: {
      baseUrl: APP_PUBLIC_BASE_URL,
    },
    cors: {
      allowedOrigin: APP_CORS_ORIGIN,
    },
  },
  databases: {
    mongodb: {
      uri: MONGODB_URI,
      dbName: MONGODB_DATABASE,
    },
  },
  services: {
    google: {
      baseUrl: 'https://oauth2.googleapis.com/token',
      clientId: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
      scope: 'https://www.googleapis.com/auth/youtube',
    },
    youtube: {
      apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    },
  },
};
