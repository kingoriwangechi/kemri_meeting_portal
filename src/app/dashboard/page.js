"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import MeetingList from "@/components/MeetingList";

export default function Dashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [meetings, setMeetings] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === "loading") return;
		if (!session) {
			router.push("/auth/signin");
			return;
		}
		fetchMeetings();
	}, [session, status, router]);

	const fetchMeetings = async () => {
		try {
			const response = await fetch("/api/meetings");
			if (response.ok) {
				const data = await response.json();
				setMeetings(data);
			}
		} catch (error) {
			console.error("Error fetching meetings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleMeetingCreated = (newMeeting) => {
		setMeetings([...meetings, newMeeting]);
		setShowForm(false);
	};

	const handleMeetingDeleted = (meetingId) => {
		setMeetings(meetings.filter((m) => m.id !== meetingId));
	};

	if (status === "loading" || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="flex items-center">
							<div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
								<span className="text-white font-bold text-lg">K</span>
							</div>
							<h1 className="ml-3 text-xl font-semibold text-gray-900">
								KEMRI Meeting Portal
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-700">
								Welcome, {session.user.name}
							</span>
							<button
								onClick={() => signOut()}
								className="text-sm text-gray-500 hover:text-gray-700"
							>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900">My Meetings</h2>
					<button
						onClick={() => setShowForm(true)}
						className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Create Meeting
					</button>
				</div>

				{/* Meeting Form Modal */}
				{showForm && (
					<MeetingForm
						onClose={() => setShowForm(false)}
						onMeetingCreated={handleMeetingCreated}
					/>
				)}

				{/* Meetings List */}
				<MeetingList
					meetings={meetings}
					onMeetingDeleted={handleMeetingDeleted}
				/>
			</main>
		</div>
	);
}
