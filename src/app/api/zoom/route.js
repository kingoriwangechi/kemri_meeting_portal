import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(request) {
	try {
		// Get session to verify user is authenticated
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse meeting data from request body
		const data = await request.json();

		// Simulate creating a Zoom meeting
		const zoomMeeting = {
			id: Math.floor(Math.random() * 1000000000),
			host_id: "YOUR_ZOOM_USER_ID",
			host_email: session.user.email,
			topic: data.title,
			type: data.isRecurring ? 8 : 2, // 2 = scheduled meeting, 8 = recurring meeting
			start_time: `${data.date}T${data.time}:00`,
			duration: data.duration,
			timezone: data.timezone,
			agenda: data.description,
			created_at: new Date().toISOString(),
			join_url: `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`,
			password: data.passcode || "",
			settings: {
				host_video: data.hostVideo,
				participant_video: data.participantVideo,
				join_before_host: data.allowJoinAnytime,
				mute_upon_entry: data.muteParticipants,
				watermark: false,
				use_pmi: data.meetingIdType === "personal",
				approval_type: data.enableWaitingRoom ? 1 : 0,
				audio: "both",
				auto_recording: data.autoRecord ? "local" : "none",
				waiting_room: data.enableWaitingRoom,
			},
		};

		return NextResponse.json(zoomMeeting, { status: 200 });
	} catch (error) {
		console.error("Error in Zoom API:", error);
		return NextResponse.json(
			{ error: "Failed to create Zoom meeting" },
			{ status: 500 }
		);
	}
}
