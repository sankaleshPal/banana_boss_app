const isLocalWeb =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const pick = (...values: Array<string | undefined>): string | undefined =>
  values.find((value) => typeof value === 'string' && value.trim().length > 0);

const localApiBaseUrl = pick(
  process.env.EXPO_PUBLIC_DEV_API_BASE_URL,
  process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL,
  process.env.EXPO_PUBLIC_API_BASE_URL,
  process.env['API_BASE_URL'],
  'http://localhost:4500',
);

const prodApiBaseUrl = pick(
  process.env.EXPO_PUBLIC_API_BASE_URL,
  process.env['API_BASE_URL'],
  'https://api.bananabillz.com',
);

export const API_BASE_URL = isLocalWeb ? localApiBaseUrl! : prodApiBaseUrl!;

export const SERVER_SECRET =
  (isLocalWeb
    ? pick(
        process.env.EXPO_PUBLIC_DEV_SERVER_SECRET,
        process.env.EXPO_PUBLIC_LOCAL_SERVER_SECRET,
        process.env.EXPO_PUBLIC_SERVER_SECRET,
        process.env['SERVER_SECRET'],
        'SERVER_SECRET',
      )
    : pick(
        process.env.EXPO_PUBLIC_SERVER_SECRET,
        process.env['SERVER_SECRET'],
        process.env.EXPO_PUBLIC_DEV_SERVER_SECRET,
        'SERVER_SECRET',
      )) ?? '';

export const API_SERVER_SECRET =
  (isLocalWeb
    ? pick(
        process.env.EXPO_PUBLIC_DEV_API_SERVER_SECRET,
        process.env.EXPO_PUBLIC_LOCAL_API_SERVER_SECRET,
        process.env.EXPO_PUBLIC_API_SERVER_SECRET,
        process.env['API_SERVER_SECRET'],
        'API_SERVER_SECRET',
      )
    : pick(
        process.env.EXPO_PUBLIC_API_SERVER_SECRET,
        process.env['API_SERVER_SECRET'],
        process.env.EXPO_PUBLIC_DEV_API_SERVER_SECRET,
        'API_SERVER_SECRET',
      )) ?? '';
