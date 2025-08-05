// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   ignoreDuringBuilds: true,
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
