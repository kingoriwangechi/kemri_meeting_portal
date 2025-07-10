"use client";

import { useState } from "react";

const MEETING_TYPES = [
	{ value: "internal", label: "Internal Meeting" },
	{ value: "external", label: "External Meeting" },
	{ value: "research", label: "Research Meeting" },
	{ value: "training", label: "Training Session" },
];

const PLATFORMS = [
	{ value: "zoom", label: "Zoom" },
	{ value: "teams", label: "Microsoft Teams" },
];

export default function MeetingForm({ onClose, onMeetingCreated }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		dateTime: "",
		type: "internal",
		platform: "zoom",
		attendees: "",
		meetingLink: "",
	});
	const [isRestrictive, setIsRestrictive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const attendeesArray = isRestrictive
				? formData.attendees
						.split(",")
						.map((email) => email.trim())
						.filter((email) => email)
				: [];

			const response = await fetch("/api/meetings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					attendees: attendeesArray,
					isRestrictive,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create meeting");
			}

			const newMeeting = await response.json();
			onMeetingCreated(newMeeting);
			onClose();
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
			// Clear meeting link when switching to Zoom
			...(name === "platform" && value === "zoom" ? { meetingLink: "" } : {}),
		}));
	};

	const isZoomPlatform = formData.platform === "zoom";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-900">
						Create New Meeting
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600"
					>
						<span className="sr-only">Close</span>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700"
						>
							Meeting Title *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							required
							value={formData.title}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows={3}
							value={formData.description}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
						/>
					</div>

					<div>
						<label
							htmlFor="dateTime"
							className="block text-sm font-medium text-gray-700"
						>
							Date & Time *
						</label>
						<input
							type="text"
							id="dateTime"
							name="dateTime"
							required
							value={formData.dateTime}
							onChange={handleChange}
							placeholder="YYYY-MM-DD HH:MM (e.g., 2025-07-15 14:30)"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
						/>
					</div>

					<div>
						<label
							htmlFor="type"
							className="block text-sm font-medium text-gray-700"
						>
							Meeting Type *
						</label>
						<select
							id="type"
							name="type"
							required
							value={formData.type}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
						>
							{MEETING_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="platform"
							className="block text-sm font-medium text-gray-700"
						>
							Platform *
						</label>
						<select
							id="platform"
							name="platform"
							required
							value={formData.platform}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
						>
							{PLATFORMS.map((platform) => (
								<option key={platform.value} value={platform.value}>
									{platform.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="meetingLink"
							className="block text-sm font-medium text-gray-700"
						>
							Meeting Link
							{isZoomPlatform && (
								<span className="text-sm text-gray-500 ml-1">
									(Will be generated automatically)
								</span>
							)}
						</label>
						<input
							type="url"
							id="meetingLink"
							name="meetingLink"
							value={formData.meetingLink}
							onChange={handleChange}
							placeholder={
								isZoomPlatform
									? "Will be generated automatically"
									: "https://teams.microsoft.com/..."
							}
							disabled={isZoomPlatform}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 text-black"
						/>
					</div>

					<div className="flex items-center">
						<input
							id="isRestrictive"
							type="checkbox"
							checked={isRestrictive}
							onChange={(e) => setIsRestrictive(e.target.checked)}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="isRestrictive"
							className="ml-2 block text-sm text-gray-700"
						>
							Restrict access (only invited attendees can join)
						</label>
					</div>

					{isRestrictive && (
						<div>
							<label
								htmlFor="attendees"
								className="block text-sm font-medium text-gray-700"
							>
								Attendees (Email addresses, comma-separated)
							</label>
							<textarea
								id="attendees"
								name="attendees"
								rows={3}
								value={formData.attendees}
								onChange={handleChange}
								placeholder="user1@kemri.go.ke, user2@kemri.go.ke"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
							/>
						</div>
					)}

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
						>
							{loading ? "Creating..." : "Create Meeting"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
