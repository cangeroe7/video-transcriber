import { enableTailwind } from "@remotion/tailwind";
import path from "path";

/**
 *  @param {import('webpack').Configuration} currentConfig
 */
export const webpackOverride = (currentConfig) => {
	const config = enableTailwind(currentConfig);
	
	// Add alias for ~ to resolve to src/
	if (!config.resolve) {
		config.resolve = {};
	}
	
	// Create new alias object with the ~ alias
	config.resolve.alias = {
		...config.resolve.alias,
		"~": path.resolve(process.cwd(), "src")
	};
	
	return config;
};
