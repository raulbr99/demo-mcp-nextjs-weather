import type { NextConfig } from "next";
import { baseURL } from "./baseUrl";

const nextConfig: NextConfig = {
  // Only use assetPrefix in production, not in development
  assetPrefix: process.env.NODE_ENV === "production" ? baseURL : undefined,
};

export default nextConfig;
