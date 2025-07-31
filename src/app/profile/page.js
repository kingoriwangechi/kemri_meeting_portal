"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";

export default function ProfilePage() {
	const { data: session, status, update } = useSession();
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		department: "",
	});
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState(null);

	// Update form data when session is loaded
	useState(() => {
		if (status === "authenticated" && session?.user) {
			setFormData({
				name: session.user.name || "",
				email: session.user.email || "",
				department: session.user.department || "",
			});
			setLoading(false);
		} else if (status === "unauthenticated") {
			router.push("/auth/signin");
		}
	}, [session, status, router]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setNotification(null);

		try {
			// Call API to update user profile
			// In a real implementation, this would update the user info in the database
			// For now, we'll just update the session
			await update({
				...session,
				user: {
					...session.user,
					name: formData.name,
					department: formData.department,
				},
			});

			setNotification({
				type: "success",
				message: "Profile updated successfully!",
			});
		} catch (error) {
			setNotification({
				type: "error",
				message: "Failed to update profile. Please try again.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (status === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
				<p className="text-gray-600">Manage your account information</p>
			</div>

			{notification && (
				<Alert
					type={notification.type}
					message={notification.message}
					onClose={() => setNotification(null)}
					autoClose
					className="mb-6"
				/>
			)}

			<div className="bg-white shadow rounded-lg overflow-hidden">
				<div className="px-4 py-5 sm:p-6">
					<div className="flex flex-col sm:flex-row gap-6">
						<div className="flex-shrink-0 flex flex-col items-center">
							<div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
								{session?.user?.image ? (
									<Image
										src={session.user.image}
										alt="Profile"
										width={96}
										height={96}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-800 text-2xl font-semibold">
										{session?.user?.name?.charAt(0) ||
											session?.user?.email?.charAt(0) ||
											"U"}
									</div>
								)}
							</div>
							<p className="mt-2 text-sm text-gray-500">
								Profile picture provided by your authentication provider
							</p>
						</div>

						<div className="flex-grow">
							<form onSubmit={handleSubmit}>
								<div className="space-y-6">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700"
										>
											Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											disabled
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
										/>
										<p className="mt-1 text-xs text-gray-500">
											Email cannot be changed as it is linked to your account
										</p>
									</div>

									<div>
										<label
											htmlFor="department"
											className="block text-sm font-medium text-gray-700"
										>
											Department
										</label>
										<input
											type="text"
											id="department"
											name="department"
											value={formData.department}
											onChange={handleChange}
											placeholder="e.g., Research & Development"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700">
											Authentication Method
										</label>
										<div className="mt-1 flex items-center">
											<span className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
												{session?.provider === "google" ? (
													<>
														<svg
															className="w-5 h-5 mr-2"
															fill="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																d="M12.545 10.239v3.821h5.445c-0.212 1.2-0.999 2.4-2.394 3.184l3.83 2.991c2.271-2.094 3.575-5.164 3.575-8.807 0-0.778-0.075-1.566-0.211-2.315l-10.245 0.126z"
																fill="#4285F4"
															/>
															<path
																d="M5.092 14.745l-0.444 1.704-1.612 0.034c-1.066-1.999-1.66-4.264-1.66-6.483 0-2.181 0.577-4.407 1.614-6.374l2.827 0.516 1.235 2.811c-0.26 0.868-0.399 1.783-0.399 2.722 0 1.842 0.553 3.559 1.5 4.995l-2.061 0.076z"
																fill="#34A853"
															/>
															<path
																d="M12.545 4.987c1.699 0 3.21 0.589 4.405 1.739l3.29-3.289c-2.074-1.929-4.786-3.112-7.695-3.112-4.706 0-8.773 2.768-10.624 6.769l3.963 3.047c0.945-2.779 3.539-4.796 6.661-4.796z"
																fill="#EA4335"
															/>
															<path
																d="M12.545 19.363c-3.09 0-5.723-2.084-6.66-4.797l-3.963 3.048c1.851 4.001 5.918 6.768 10.623 6.768 2.77 0 5.42-0.92 7.435-2.641l-3.771-2.93c-1.057 0.635-2.406 1.01-3.664 1.01z"
																fill="#FBBC05"
															/>
														</svg>
														Google
													</>
												) : session?.provider === "azure-ad" ? (
													<>
														<svg
															className="w-5 h-5 mr-2"
															fill="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																d="M11.357 2H16.809L5.6221 22H0.1709L11.357 2Z"
																fill="#FBBC05"
															/>
															<path
																d="M17.357 9.458C19.609 9.458 21.145 10.985 21.145 13.23C21.145 15.475 19.609 17 17.357 17H12.703V9.458H17.357Z"
																fill="#4285F4"
															/>
														</svg>
														Microsoft
													</>
												) : (
													<>
														<svg
															className="w-5 h-5 mr-2"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
															/>
														</svg>
														Email/Password
													</>
												)}
											</span>
										</div>
									</div>
								</div>

								<div className="mt-6">
									<button
										type="submit"
										disabled={isSaving}
										className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSaving ? (
											<>
												<LoadingSpinner size="sm" className="mr-2" /> Saving...
											</>
										) : (
											"Save Changes"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
