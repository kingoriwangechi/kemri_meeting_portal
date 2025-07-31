import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
	getMeetings,
	addMeeting,
	deleteMeeting,
	updateMeeting,
} from "@/lib/storage";
import { sendMeetingInvitation } from "@/lib/email";
import {
	createZoomMeeting,
	deleteZoomMeeting,
	updateZoomMeeting,
} from "@/lib/zoom";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const meetings = getMeetings();
	return NextResponse.json(meetings);
}

export async function POST(request) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const {
			title,
			description,
			dateTime,
			type,
			platform,
			attendees,
			meetingLink,
			isRestrictive,
		} = body;

		// Create Zoom meeting if platform is zoom and no meeting link provided
		let finalMeetingLink = meetingLink;
		let zoomMeetingId = null;
		let zoomInvitation = null;

		if (platform === "zoom" && !meetingLink) {
			try {
				const zoomMeeting = await createZoomMeeting({
					topic: title,
					startTime: dateTime,
					duration: 60, // Default duration of 1 hour
					agenda: description,
				});
				finalMeetingLink = zoomMeeting.join_url;
				zoomMeetingId = zoomMeeting.id;
				zoomInvitation = zoomMeeting.invitation;
			} catch (error) {
				console.error("Error creating Zoom meeting:", error);
				return NextResponse.json(
					{ error: error.message || "Failed to create Zoom meeting" },
					{ status: 500 }
				);
			}
		}

		const meeting = {
			id: uuidv4(),
			title,
			description,
			dateTime,
			type,
			platform,
			attendees: attendees || [],
			isRestrictive: isRestrictive || false,
			meetingLink: finalMeetingLink,
			zoomMeetingId,
			zoomInvitation,
			organizer: session.user.email,
			createdAt: new Date().toISOString(),
			status: "scheduled",
		};

		const saved = addMeeting(meeting);

		if (!saved) {
			// If meeting save fails and we created a Zoom meeting, try to clean it up
			if (zoomMeetingId) {
				try {
					await deleteZoomMeeting(zoomMeetingId);
				} catch (error) {
					console.error("Error cleaning up Zoom meeting:", error);
				}
			}
			return NextResponse.json(
				{ error: "Failed to save meeting" },
				{ status: 500 }
			);
		}

		// Send email invitations only if meeting is restrictive and attendees are provided
		if (isRestrictive && attendees && attendees.length > 0) {
			const emailContent =
				platform === "zoom" && zoomInvitation
					? zoomInvitation // Use Zoom's formatted invitation
					: meeting; // Use our default format

			const emailResult = await sendMeetingInvitation(emailContent, attendees);
			if (!emailResult.success) {
				console.error("Failed to send email invitations:", emailResult.error);
			}
		}

		return NextResponse.json(meeting, { status: 201 });
	} catch (error) {
		console.error("Error creating meeting:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const meetingId = searchParams.get("id");

		if (!meetingId) {
			return NextResponse.json(
				{ error: "Meeting ID required" },
				{ status: 400 }
			);
		}

		const meeting = getMeetings().find((m) => m.id === meetingId);

		if (meeting?.zoomMeetingId) {
			try {
				await deleteZoomMeeting(meeting.zoomMeetingId);
			} catch (error) {
				console.error("Error deleting Zoom meeting:", error);
				// Continue with deletion even if Zoom cleanup fails
			}
		}

		const deleted = deleteMeeting(meetingId);

		if (!deleted) {
			return NextResponse.json(
				{ error: "Failed to delete meeting" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting meeting:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
