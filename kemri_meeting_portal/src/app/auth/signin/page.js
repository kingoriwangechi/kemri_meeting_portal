"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SignIn() {
	const [providers, setProviders] = useState(null);

	useEffect(() => {
		const fetchProviders = async () => {
			const res = await getProviders();
			setProviders(res);
		};
		fetchProviders();
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
						<span className="text-white font-bold text-xl">K</span>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						KEMRI Meeting Portal
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Sign in to your account
					</p>
					<p className="mt-2 text-center text-xs text-gray-500">
						Only @kemri.go.ke email addresses are allowed
					</p>
				</div>
				<div className="mt-8 space-y-4">
					{providers &&
						Object.values(providers).map((provider) => (
							<div key={provider.name}>
								<button
									onClick={() => signIn(provider.id)}
									className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									Sign in with {provider.name}
								</button>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
