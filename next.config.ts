import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất ra HTML tĩnh -> deploy được lên Vercel, Netlify, GitHub Pages, hosting thường.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
