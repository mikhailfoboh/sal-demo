/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'expo-router',
    'react-native-safe-area-context',
    '@expo/vector-icons',
    'lucide-react-native',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-web$': 'react-native-web',
    };
    
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },
};

module.exports = nextConfig; 