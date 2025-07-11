"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (error) => {
		console.log("Auth error:", error);
		switch (error) {
			case "AccessDenied":
				return "Access denied. Only @kemri.go.ke email addresses are allowed.";
			case "Configuration":
				return "Server configuration error. Please contact support.";
			case "Verification":
				return "Verification failed. Please try again.";
			case "OAuthSignin":
				return "Error starting the OAuth sign-in process. Please try again.";
			case "OAuthCallback":
				return "Error processing the OAuth callback. Check redirect URI configuration.";
			case "OAuthCreateAccount":
				return "Error creating OAuth account. Please try again.";
			case "EmailCreateAccount":
				return "Error creating email account. Please try again.";
			case "Callback":
				return "Error processing the authentication callback. Please try again.";
			case "OAuthAccountNotLinked":
				return "This email is already associated with another account. Please sign in using the original provider.";
			case "SessionRequired":
				return "You must be signed in to access this page.";
			default:
				return `An error occurred during authentication (${
					error || "unknown"
				}). Please try again.`;
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-16 w-16 flex items-center justify-center">
						<img
							src="/images/logo.png"
							alt="KEMRI Logo"
							className="h-16 w-16 rounded-full"
						/>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Authentication Error
					</h2>
					<p className="mt-2 text-center text-sm text-red-600">
						{getErrorMessage(error)}
					</p>
					<div className="mt-4 text-center text-xs text-gray-500">
						{error && <p>Error code: {error}</p>}
					</div>
				</div>
				<div className="mt-8">
					<Link
						href="/auth/signin"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Try Again
					</Link>
				</div>

				<div className="mt-8 bg-gray-100 p-4 rounded-lg text-xs text-gray-700">
					<h3 className="font-bold mb-2">Debug Information:</h3>
					<p>Error Code: {error || "unknown"}</p>
					<p>Time: {new Date().toLocaleString()}</p>
					<p>
						If problems persist, please contact your administrator with this
						information.
					</p>
				</div>
			</div>
		</div>
	);
}

export default function AuthError() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
