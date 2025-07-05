// remotion.config.ts
import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";
// 1) change still-frame format to JPEG
Config.setVideoImageFormat("jpeg");

Config.overrideWebpackConfig(webpackOverride);
