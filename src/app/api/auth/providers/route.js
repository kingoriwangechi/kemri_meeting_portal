import { NextResponse } from "next/server";

// This endpoint returns the available auth providers
export async function GET() {
	// Simple list of available providers
	const providers = {
		google: {
			id: "google",
			name: "Google",
			type: "oauth",
			available: !!process.env.GOOGLE_ID && !!process.env.GOOGLE_SECRET,
		},
		"azure-ad": {
			id: "azure-ad",
			name: "Microsoft",
			type: "oauth",
			available:
				!!process.env.AZURE_AD_CLIENT_ID &&
				!!process.env.AZURE_AD_CLIENT_SECRET,
		},
		credentials: {
			id: "credentials",
			name: "Email/Password",
			type: "credentials",
			available: true,
		},
	};

	return NextResponse.json(providers);
}
