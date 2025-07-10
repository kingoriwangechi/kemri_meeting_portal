"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignIn() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid credentials");
				return;
			}

			router.push("/dashboard");
		} catch (error) {
			setError("An error occurred. Please try again.");
		}
	};

	const handleGoogleSignIn = () => {
		signIn("google", { callbackUrl: "/dashboard" });
	};

	const handleMicrosoftSignIn = () => {
		signIn("azure-ad", { callbackUrl: "/dashboard" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<div className="text-center mb-8">
						<div className="mx-auto h-20 w-20 flex items-center justify-center mb-4">
							<Image
								src="/images/logo.png"
								alt="KEMRI Logo"
								width={80}
								height={80}
								className="rounded-full"
							/>
						</div>
						<h2 className="text-2xl font-bold text-gray-900">
							{isLogin ? "Welcome Back" : "Create Account"}
						</h2>
						<p className="text-gray-600 mt-2">
							{isLogin
								? "Sign in to your account"
								: "Sign up for a new account"}
						</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-black"
								placeholder="Enter your password"
							/>
						</div>

						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{isLogin ? "Sign In" : "Sign Up"}
						</button>
					</form>

					<p className="mt-4 text-center text-sm text-gray-600">
						{isLogin ? "Don't have an account? " : "Already have an account? "}
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							{isLogin ? "Sign up" : "Sign in"}
						</button>
					</p>

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={handleGoogleSignIn}
							className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<svg
								className="h-5 w-5 mr-2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Google
						</button>
						<button
							type="button"
							onClick={handleMicrosoftSignIn}
							className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							<svg
								className="h-5 w-5 mr-2"
								viewBox="0 0 23 23"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path fill="#f25022" d="M1 1h10v10H1z" />
								<path fill="#00a4ef" d="M1 12h10v10H1z" />
								<path fill="#7fba00" d="M12 1h10v10H12z" />
								<path fill="#ffb900" d="M12 12h10v10H12z" />
							</svg>
							Microsoft
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
