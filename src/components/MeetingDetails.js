"use client";

import { useState } from "react";
import { format } from "date-fns";

export default function MeetingDetails({ meeting, onClose }) {
	const [copySuccess, setCopySuccess] = useState("");

	if (!meeting) return null;

	const meetingDate = new Date(meeting.dateTime);
	const formattedDate = format(meetingDate, "EEEE, MMMM d, yyyy");
	const formattedTime = format(meetingDate, "h:mm a");

	const getMeetingTypeLabel = (type) => {
		const types = {
			internal: "Internal Meeting",
			external: "External Meeting",
			research: "Research Meeting",
			training: "Training Session",
		};
		return types[type] || type;
	};

	const getPlatformLabel = (platform) => {
		const platforms = {
			zoom: "Zoom",
			teams: "Microsoft Teams",
		};
		return platforms[platform] || platform;
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(
			() => {
				setCopySuccess("Copied!");
				setTimeout(() => setCopySuccess(""), 2000);
			},
			() => {
				setCopySuccess("Failed to copy");
			}
		);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold text-gray-900">
						Meeting Details
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

				<div className="space-y-4">
					<div>
						<h4 className="text-xl font-semibold text-gray-900">
							{meeting.title}
						</h4>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
							{getMeetingTypeLabel(meeting.type)}
						</span>
					</div>

					<div>
						<div className="text-sm text-gray-500">Date and Time</div>
						<div className="mt-1 flex items-center">
							<svg
								className="h-5 w-5 text-gray-400 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span className="text-gray-900">
								{formattedDate} at {formattedTime}
							</span>
						</div>
					</div>

					<div>
						<div className="text-sm text-gray-500">Platform</div>
						<div className="mt-1 flex items-center">
							<svg
								className="h-5 w-5 text-gray-400 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							<span className="text-gray-900">
								{getPlatformLabel(meeting.platform)}
							</span>
						</div>
					</div>

					<div>
						<div className="text-sm text-gray-500">Description</div>
						<div className="mt-1 text-gray-900 whitespace-pre-wrap">
							{meeting.description}
						</div>
					</div>

					{meeting.meetingLink && (
						<div>
							<div className="text-sm text-gray-500">Meeting Link</div>
							<div className="mt-1 flex items-center">
								<div className="flex-1 truncate">
									{new Date(meeting.dateTime) > new Date() ? (
										<a
											href={meeting.meetingLink}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 hover:underline truncate"
										>
											{meeting.meetingLink}
										</a>
									) : (
										<span className="text-gray-500 truncate">
											{meeting.meetingLink}
											<span className="ml-2 text-xs text-red-500">(Meeting has ended)</span>
										</span>
									)}
								</div>
								<button
									onClick={() => copyToClipboard(meeting.meetingLink)}
									className="ml-2 flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
									title="Copy to clipboard"
								>
									{copySuccess ? (
										<span className="text-green-500 text-xs">
											{copySuccess}
										</span>
									) : (
										<svg
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					)}

					{meeting.attendees && meeting.attendees.length > 0 && (
						<div>
							<div className="text-sm text-gray-500">
								Attendees ({meeting.attendees.length})
							</div>
							<div className="mt-1 max-h-40 overflow-y-auto">
								<ul className="divide-y divide-gray-200">
									{meeting.attendees.map((attendee, index) => (
										<li key={index} className="py-2 flex items-center">
											<div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
												<span className="text-blue-800 text-xs font-medium">
													{attendee.charAt(0).toUpperCase()}
												</span>
											</div>
											<span className="text-gray-900">{attendee}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}
				</div>

				<div className="mt-6">
					<button
						onClick={onClose}
						className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
