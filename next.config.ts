import type { NextConfig } from "next";

const pagesBasePath = process.env.GITHUB_PAGES === "true"
  ? "/icao-level-4-trainer"
  : "";

const nextConfig: NextConfig = {
  assetPrefix: pagesBasePath,
};

export default nextConfig;
