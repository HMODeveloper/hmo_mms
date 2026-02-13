import type { NextConfig } from "next"
import config from "@/src/lib/config"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${config.BACKEND_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
