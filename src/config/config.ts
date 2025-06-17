const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI,
  APP_PUBLIC_BASE_URL,
  MONGODB_URI,
  MONGODB_DATABASE,
  APP_CORS_ORIGIN,
} = process.env;

export interface Config {
  app: {
    web: {
      baseUrl?: string;
    };
    cors: {
      allowedOrigin: string;
    };
  };
  databases: {
    mongodb: {
      uri?: string;
      dbName?: string;
    };
  };
  services: {
    google: {
      baseUrl: string;
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
      scope: string;
    };
    youtube: {
      apiBaseUrl: string;
    };
  };
}

export const config: Config = {
  app: {
    web: {
      baseUrl: APP_PUBLIC_BASE_URL,
    },
    cors: {
      allowedOrigin: APP_CORS_ORIGIN || '*localhost*',
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
  }
};

