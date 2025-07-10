"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const getErrorMessage = (error) => {
		switch (error) {
			case "AccessDenied":
				return "Access denied. Only @kemri.go.ke email addresses are allowed.";
			case "Configuration":
				return "Server configuration error. Please contact support.";
			case "Verification":
				return "Verification failed. Please try again.";
			default:
				return "An error occurred during authentication. Please try again.";
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
						<span className="text-white font-bold text-xl">!</span>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Authentication Error
					</h2>
					<p className="mt-2 text-center text-sm text-red-600">
						{getErrorMessage(error)}
					</p>
				</div>
				<div className="mt-8">
					<Link
						href="/auth/signin"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Try Again
					</Link>
				</div>
			</div>
		</div>
	);
}

export default function AuthError() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		}>
			<ErrorContent />
		</Suspense>
	);
}
