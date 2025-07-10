"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<div className="text-center mb-8">
						<div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
							<span className="text-white font-bold text-xl">K</span>
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

					<button
						type="button"
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center py-2 px-4 mb-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
							<path
								d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
								fill="currentColor"
							/>
						</svg>
						Continue with Google
					</button>

					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">
								Or continue with email
							</span>
						</div>
					</div>

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
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
								className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
				</div>
			</div>
		</div>
	);
}
