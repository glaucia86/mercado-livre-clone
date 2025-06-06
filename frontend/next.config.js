/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['http2.mlstatic.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001/api'
  }
}

module.exports = nextConfig