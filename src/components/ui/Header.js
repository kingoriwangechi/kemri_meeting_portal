"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
	const { data: session } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="bg-white shadow-sm sticky top-0 z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<div className="h-10 w-10 flex items-center justify-center">
								<Image
									src="/images/logo.png"
									alt="KEMRI Logo"
									width={40}
									height={40}
								/>
							</div>
							<h1 className="ml-3 text-xl font-semibold text-gray-900">
								KEMRI Meeting Portal
							</h1>
						</Link>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-500 hover:text-gray-700 focus:outline-none"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>

					{/* Desktop navigation */}
					{session && (
						<div className="hidden md:flex items-center space-x-6">
							<Link
								href="/dashboard"
								className="text-sm text-gray-700 hover:text-blue-600"
							>
								Dashboard
							</Link>
							<Link
								href="/profile"
								className="text-sm text-gray-700 hover:text-blue-600"
							>
								Profile
							</Link>
							<div className="relative group">
								<button className="flex items-center text-sm text-gray-700 hover:text-blue-600">
									<span>{session.user.name}</span>
									<svg
										className="ml-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
									<Link
										href="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Your Profile
									</Link>
									<button
										onClick={() => signOut()}
										className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Sign Out
									</button>
								</div>
							</div>
						</div>
					)}

					{!session && (
						<div className="hidden md:block">
							<Link
								href="/auth/signin"
								className="text-sm font-medium text-blue-600 hover:text-blue-800"
							>
								Sign In
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
						{session ? (
							<>
								<Link
									href="/dashboard"
									className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
									onClick={() => setIsMenuOpen(false)}
								>
									Dashboard
								</Link>
								<Link
									href="/profile"
									className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
									onClick={() => setIsMenuOpen(false)}
								>
									Profile
								</Link>
								<button
									onClick={() => {
										setIsMenuOpen(false);
										signOut();
									}}
									className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
								>
									Sign Out
								</button>
							</>
						) : (
							<Link
								href="/auth/signin"
								className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50"
								onClick={() => setIsMenuOpen(false)}
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
