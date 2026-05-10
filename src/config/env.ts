// react-native-dotenv babel plugin transforms these imports at build time for
// both native (APK) and web (Metro/Vercel) builds, baking values from .env
// directly into the bundle. The process.env fallback covers plain Node / CI.
import {
  API_BASE_URL as _API_BASE_URL,
  SERVER_SECRET as _SERVER_SECRET,
  API_SERVER_SECRET as _API_SERVER_SECRET,
} from '@env';

export const API_BASE_URL      = _API_BASE_URL      || (typeof process !== 'undefined' ? process.env.API_BASE_URL      : '') || 'http://localhost:4500';
export const SERVER_SECRET     = _SERVER_SECRET     || (typeof process !== 'undefined' ? process.env.SERVER_SECRET     : '') || '';
export const API_SERVER_SECRET = _API_SERVER_SECRET || (typeof process !== 'undefined' ? process.env.API_SERVER_SECRET : '') || '';
