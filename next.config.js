const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environment variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) &&
    process.env.STAGING !== '1';
  // when `next build` or `npm run build` is used
  const isStaging =
    (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) &&
    process.env.STAGING === '1';

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}   phase:${phase}`);

  const env = {
    NEXT_PUBLIC_APP_BASE_URL: (() => {
      if (isProd) {
        return process.env.NEXT_PUBLIC_APP_BASE_URL_PROD;
      }
      return process.env.NEXT_PUBLIC_APP_BASE_URL;
    })(),
  };

  return {
    env,
    reactStrictMode: true,
    compiler: { styledComponents: true },
    /* config options here */
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },

    // redirects: async =() => {
    //   return [
    //     {
    //       source: '/login',
    //       destination: '/auth/login',
    //       permanent: true,
    //     }
    //   ]
    // },
  };
};
