// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your Next.js config options here
  experimental: {
    serverActions: {
      
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

