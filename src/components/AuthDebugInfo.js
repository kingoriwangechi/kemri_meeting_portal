"use client";

import { useState, useEffect } from "react";

export default function AuthDebugInfo() {
	const [debugInfo, setDebugInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		async function fetchDebugInfo() {
			try {
				const response = await fetch("/api/auth-debug");
				const data = await response.json();
				setDebugInfo(data);
			} catch (error) {
				console.error("Failed to fetch auth debug info:", error);
				setDebugInfo({ error: "Failed to load configuration data" });
			} finally {
				setLoading(false);
			}
		}

		fetchDebugInfo();
	}, []);

	if (loading) {
		return (
			<div className="text-xs text-gray-500 mt-4">
				Loading configuration status...
			</div>
		);
	}

	if (!debugInfo) {
		return null;
	}

	const hasMissingVars = debugInfo.status !== "OK";

	return (
		<div
			className={`mt-6 p-3 rounded text-xs ${
				hasMissingVars
					? "bg-yellow-100 border border-yellow-300"
					: "bg-green-100 border border-green-300"
			}`}
		>
			<div className="flex justify-between items-center">
				<div>
					<span className="font-medium">Authentication Config:</span>
					<span
						className={
							hasMissingVars
								? "text-red-600 font-medium"
								: "text-green-600 font-medium"
						}
					>
						{hasMissingVars ? "Missing Variables" : "OK"}
					</span>
				</div>
				<button
					onClick={() => setShowDetails(!showDetails)}
					className="text-blue-600 hover:text-blue-800"
				>
					{showDetails ? "Hide Details" : "Show Details"}
				</button>
			</div>

			{showDetails && (
				<div className="mt-2 space-y-1">
					{Object.entries(debugInfo.config).map(([key, exists]) => (
						<div key={key} className="flex justify-between">
							<span>{key}</span>
							<span className={exists ? "text-green-600" : "text-red-600"}>
								{exists ? "✓" : "✗"}
							</span>
						</div>
					))}
					{hasMissingVars && (
						<div className="mt-2 text-red-600">
							Missing {debugInfo.missingCount} required environment variables.
							Check your .env.local file.
						</div>
					)}
				</div>
			)}
		</div>
	);
}
