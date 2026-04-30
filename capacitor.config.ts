import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ng.kraft.app',
  appName: 'Kraft',
  // Server mode: loads your deployed website in a native shell.
  // This means all features work (SSR, middleware, dynamic routes).
  // Update the URL to your production Vercel domain.
  server: {
    // For development, use your local dev server:
    // For Android emulator use 10.0.2.2 (maps to host machine's localhost)
    // For physical device use your computer's local IP (e.g., 192.168.x.x:3000)
    // For production use your deployed URL (e.g., https://kraft.ng)
    url: 'http://10.0.2.2:3000/market',
    // For production, change to your deployed URL:
    // url: 'https://kraft.ng',
    cleartext: true, // Allow HTTP for local dev (Android blocks HTTP by default)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0a', // Dark background matching your app
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
      splashFullScreen: true,
    },
    StatusBar: {
      style: 'DARK', // Light text on dark background
      backgroundColor: '#0a0a0a',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '989886797521-bhomg3o0qpccp1sn80q338gs7r7of5r5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  // iOS specific
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'kraft',
  },
  // Android specific
  android: {
    backgroundColor: '#0a0a0a',
    allowMixedContent: true, // For loading images from HTTP sources
  },
};

export default config;
