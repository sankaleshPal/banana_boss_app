// process.env works on web (Metro/Vercel injects at build time).
// On native, react-native-dotenv babel plugin replaces these at compile time.
export const API_BASE_URL      = process.env['API_BASE_URL']      ?? 'http://localhost:4500';
export const SERVER_SECRET     = process.env['SERVER_SECRET']     ?? '';
export const API_SERVER_SECRET = process.env['API_SERVER_SECRET'] ?? '';
