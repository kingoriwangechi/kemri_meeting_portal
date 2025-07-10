"use client";

import { format } from "date-fns";
import { useState } from "react";

export default function MeetingList({ meetings, onMeetingDeleted }) {
	const [filter, setFilter] = useState("upcoming");

	const now = new Date();
	const filteredMeetings = meetings.filter((meeting) => {
		const meetingDate = new Date(meeting.dateTime);
		if (filter === "upcoming") {
			return meetingDate >= now;
		} else {
			return meetingDate < now;
		}
	});

	const sortedMeetings = filteredMeetings.sort((a, b) => {
		const dateA = new Date(a.dateTime);
		const dateB = new Date(b.dateTime);
		return filter === "upcoming" ? dateA - dateB : dateB - dateA;
	});

	const handleDelete = async (meetingId) => {
		if (!confirm("Are you sure you want to delete this meeting?")) {
			return;
		}

		try {
			const response = await fetch(`/api/meetings?id=${meetingId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				onMeetingDeleted(meetingId);
			} else {
				alert("Failed to delete meeting");
			}
		} catch (error) {
			console.error("Error deleting meeting:", error);
			alert("Error deleting meeting");
		}
	};

	const getMeetingTypeLabel = (type) => {
		const types = {
			internal: "Internal Meeting",
			external: "External Meeting",
			research: "Research Meeting",
			training: "Training Session",
		};
		return types[type] || type;
	};

	const getPlatformIcon = (platform) => {
		switch (platform) {
			case "zoom":
				return "🎥";
			case "teams":
				return "📹";
			default:
				return "💻";
		}
	};

	return (
		<div>
			{/* Filter Tabs */}
			<div className="mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						<button
							onClick={() => setFilter("upcoming")}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								filter === "upcoming"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Upcoming (
							{meetings.filter((m) => new Date(m.dateTime) >= now).length})
						</button>
						<button
							onClick={() => setFilter("past")}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								filter === "past"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Past ({meetings.filter((m) => new Date(m.dateTime) < now).length})
						</button>
					</nav>
				</div>
			</div>

			{/* Meetings Grid */}
			{sortedMeetings.length === 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-400 text-6xl mb-4">📅</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No {filter} meetings
					</h3>
					<p className="text-gray-500">
						{filter === "upcoming"
							? "Create your first meeting to get started."
							: "No past meetings to display."}
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{sortedMeetings.map((meeting) => (
						<div
							key={meeting.id}
							className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center">
									<span className="text-2xl mr-2">
										{getPlatformIcon(meeting.platform)}
									</span>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
											{meeting.title}
										</h3>
										<p className="text-sm text-gray-500">
											{getMeetingTypeLabel(meeting.type)}
										</p>
									</div>
								</div>
								<button
									onClick={() => handleDelete(meeting.id)}
									className="text-red-400 hover:text-red-600 p-1"
									title="Delete meeting"
								>
									<svg
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</button>
							</div>

							<div className="space-y-2 mb-4">
								<div className="flex items-center text-sm text-gray-600">
									<svg
										className="h-4 w-4 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6l2 14H6L8 7z"
										/>
									</svg>
									{format(new Date(meeting.dateTime), "MMM d, yyyy")}
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<svg
										className="h-4 w-4 mr-2"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{format(new Date(meeting.dateTime), "h:mm a")}
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<svg
										className="h-4 w-4 mr-2"
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
									{meeting.isRestrictive ? (
										<span title="Restricted meeting - only invited attendees can join">
											🔒 {meeting.attendees?.length || 0} invited attendees
										</span>
									) : (
										<span title="Open meeting - anyone with the link can join">
											🔓 Open access
										</span>
									)}
								</div>
							</div>

							{meeting.description && (
								<p className="text-sm text-gray-600 mb-4 line-clamp-2">
									{meeting.description}
								</p>
							)}

							{meeting.meetingLink && (
								<div className="flex justify-end">
									<a
										href={meeting.meetingLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										Join Meeting
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
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</a>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
