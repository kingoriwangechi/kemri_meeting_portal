"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;
		if (session) {
			router.push("/dashboard");
		}
	}, [session, status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (session) {
		return null; // Will redirect to dashboard
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="flex flex-col items-center justify-center min-h-screen px-4">
				<div className="max-w-md w-full text-center">
					<div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
						<span className="text-white font-bold text-2xl">K</span>
					</div>

					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						KEMRI Meeting Portal
					</h1>

					<p className="text-lg text-gray-600 mb-8">
						Kenya Medical Research Institute
						<br />
						Secure Meeting Management System
					</p>

					<div className="space-y-4">
						<Link
							href="/auth/signin"
							className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							Sign In to Continue
						</Link>

						<p className="text-sm text-gray-500">
							Access restricted to @kemri.go.ke email addresses
						</p>
					</div>
				</div>

				<div className="mt-12 text-center">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-blue-600 text-2xl mb-2">🔒</div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Secure Authentication
							</h3>
							<p className="text-sm text-gray-600">
								Google and Microsoft OAuth integration with KEMRI domain
								restriction
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-blue-600 text-2xl mb-2">📅</div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Meeting Management
							</h3>
							<p className="text-sm text-gray-600">
								Create, schedule, and manage meetings with Zoom and Teams
								integration
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-md">
							<div className="text-blue-600 text-2xl mb-2">✉️</div>
							<h3 className="font-semibold text-gray-900 mb-2">
								Email Notifications
							</h3>
							<p className="text-sm text-gray-600">
								Automatic email invitations sent to meeting participants
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
