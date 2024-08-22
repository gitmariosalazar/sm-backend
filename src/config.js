import {configDotenv} from "dotenv";
configDotenv()

export const NODE_ENV_NAME = process.env.NODE_ENV_TEST
export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb+srv://mariosalazar10utn:1001590650ANDmar10@cluster0.iftvxqz.mongodb.net/mariosalazar";
export const TOKEN_SECRET = process.env.SECRET_KEY;

export const URL_DOMAIN =
    process.env.NODE_ENV_TEST === 'development'
        ? process.env.URL_DOMAIN_LOCAL
        : process.env.URL_DOMAIN_DEVEL;

export const FRONTEND_URL =
    process.env.NODE_ENV_TEST === 'development'
        ? process.env.FRONTEND_URL_DEVELOPMENT
        : process.env.FRONTEND_URL_PRODUCTION;

export const URL_FRONTEND = process.env.FRONTEND_URL
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID
export const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET