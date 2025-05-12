// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://courier-service-app-knnl.vercel.app/:path*'
      }
    ];
  }
};