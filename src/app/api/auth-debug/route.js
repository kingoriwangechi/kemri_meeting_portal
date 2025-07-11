// FOR DEVELOPMENT ONLY
// This endpoint checks if the NextAuth configuration is working
// Remove before deploying to production

import { NextResponse } from "next/server";

export async function GET() {
	// Only check if the required environment variables exist, don't expose their values
	const config = {
		NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
		NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
		GOOGLE_ID: !!process.env.GOOGLE_ID,
		GOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
		AZURE_AD_CLIENT_ID: !!process.env.AZURE_AD_CLIENT_ID,
		AZURE_AD_CLIENT_SECRET: !!process.env.AZURE_AD_CLIENT_SECRET,
		AZURE_AD_TENANT_ID: !!process.env.AZURE_AD_TENANT_ID,
	};

	// Count how many required variables are missing
	const missingCount = Object.values(config).filter(
		(value) => value === false
	).length;

	return NextResponse.json({
		status: missingCount === 0 ? "OK" : "MISSING_ENV_VARS",
		missingCount,
		config,
	});
}
