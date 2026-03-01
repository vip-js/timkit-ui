import path from 'path'
import { fileURLToPath } from 'url'
import type { NextConfig } from 'next'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uifaces.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // domains 字段也可同步更新
    domains: [
      'api.uifaces.co',
      'randomuser.me',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(html|vue|wxml|wxss)$/,
      type: 'asset/source',
    })
    return config
  },
  transpilePackages: ['@timui/react', '@timui/core', '@timui/tokens', '@timui/vue', '@timui/weapp'],
  turbopack: {
    root: path.join(__dirname, '..', '..'),
    rules: {
      '*.html': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.vue': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.wxml': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
      '*.wxss': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
