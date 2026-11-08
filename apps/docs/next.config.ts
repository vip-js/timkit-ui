import path from 'path'
import { fileURLToPath } from 'url'
import type { NextConfig } from 'next'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const reactRoot = path.join(__dirname, '../../packages/react')

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fast production builds run the dedicated workspace typecheck in CI. Keep
  // strict mode available through `build:strict` for local release audits.
  typescript: {
    ignoreBuildErrors: process.env.TIMKIT_FAST_BUILD === '1',
  },
  async rewrites() {
    const vuePreviewUrl = process.env.VUE_PREVIEW_INTERNAL_URL || 'http://127.0.0.1:3003'
    return [
      {
        source: '/preview/vue',
        destination: `${vuePreviewUrl}/preview/vue/`,
      },
      {
        source: '/preview/vue/:path*',
        destination: `${vuePreviewUrl}/preview/vue/:path*`,
      },
    ]
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
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Keep local source resolution for dev, but let production consume the
      // already-built ESM entry. This avoids recompiling the whole React
      // workspace during every docs build while preserving subpath exports.
      '@timui/react$': isProduction
        ? path.join(reactRoot, 'dist/index.mjs')
        : path.join(reactRoot, 'src/index.ts'),
    }
    config.module.rules.push({
      test: /\.(html|vue|wxml|wxss)$/,
      type: 'asset/source',
    })
    return config
  },
  // Published-style dist artifacts are already valid Next/Node input in a
  // production build. Dev keeps workspace transpilation for fast iteration.
  transpilePackages: isProduction
    ? []
    : ['@timui/react', '@timui/core', '@timui/agent', '@timui/tokens', '@timui/vue', '@timui/weapp'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@timui/react', '@timui/core'],
  },
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
