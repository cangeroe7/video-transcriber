/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [
            "localhost",
            "127.0.0.1", 
            "lh3.googleusercontent.com",
            "avatars.githubusercontent.com",
            "video-transcriber-tom-local.s3.us-east-2.amazonaws.com"
        ],
    },
};

export default config;
