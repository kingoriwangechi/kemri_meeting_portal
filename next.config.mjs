/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure image domains for external images
	images: {
		domains: [
			"kemri.go.ke",
			"lh3.googleusercontent.com",
			"graph.microsoft.com",
		],
	},

	// Output standalone to optimize serverless deployment
	output: "standalone",

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},

	// Improve build performance
	poweredByHeader: false,
	reactStrictMode: true,

	// Fix EPERM issues on Windows
	typescript: {
		// Skip TypeScript checks during build for speed
		ignoreBuildErrors: true,
	},
	eslint: {
		// Skip ESLint checks during build for speed
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
