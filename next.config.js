/** @type {import('next').NextConfig} */
const transpile = require('next-transpile-modules')

const withTM = transpile([
  '@stripe/firestore-stripe-payments',
])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'rb.gy']
  }
})
