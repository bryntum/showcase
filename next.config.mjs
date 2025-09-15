/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    config.module.rules.push({
      test: /\.(woff2?|ttf|eot)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]'
      }
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
