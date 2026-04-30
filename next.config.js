const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd =
    (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) &&
    process.env.STAGING !== '1';
  const isStaging =
    (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) &&
    process.env.STAGING === '1';

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}   phase:${phase}`);

  const env = {
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  };

  return {
    env,
    eslint: {
      ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    experimental: {
      scrollRestoration: true,
    },
    compiler: { styledComponents: true },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
      ],
    },
  };
};
