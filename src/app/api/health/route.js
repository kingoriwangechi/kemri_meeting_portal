import { NextResponse } from "next/server";

// Health check endpoint for monitoring application status
export async function GET() {
	try {
		// Get package.json version
		const packageJson = require("../../../../package.json");

		return NextResponse.json(
			{
				status: "ok",
				timestamp: new Date().toISOString(),
				version: packageJson.version,
				environment: process.env.NODE_ENV,
				uptime: process.uptime(),
				// Feature availability checks
				features: {
					googleAuth: !!process.env.GOOGLE_ID && !!process.env.GOOGLE_SECRET,
					microsoftAuth:
						!!process.env.AZURE_AD_CLIENT_ID &&
						!!process.env.AZURE_AD_CLIENT_SECRET,
					mongodb: !!process.env.MONGODB_URI,
					email: !!process.env.EMAIL_SERVER && !!process.env.EMAIL_FROM,
					zoom: !!process.env.ZOOM_API_KEY && !!process.env.ZOOM_API_SECRET,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Health check failed:", error);
		return NextResponse.json(
			{ status: "error", message: error.message },
			{ status: 500 }
		);
	}
}
