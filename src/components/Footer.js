import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-gray-100 py-6 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="text-gray-600 text-sm mb-4 md:mb-0">
						&copy; {new Date().getFullYear()} Kenya Medical Research Institute.
						All rights reserved.
					</div>
					<nav className="flex space-x-6">
						<Link
							href="/privacy"
							className="text-gray-600 hover:text-blue-600 text-sm"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-gray-600 hover:text-blue-600 text-sm"
						>
							Terms of Service
						</Link>
						<Link
							href="/contact"
							className="text-gray-600 hover:text-blue-600 text-sm"
						>
							Contact Us
						</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
