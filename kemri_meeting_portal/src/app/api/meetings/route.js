import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getMeetings, addMeeting, deleteMeeting } from "../../../lib/storage";
import { sendMeetingInvitation } from "../../../lib/email";
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
		} = body;

		const meeting = {
			id: uuidv4(),
			title,
			description,
			dateTime,
			type,
			platform,
			attendees: attendees || [],
			meetingLink,
			organizer: session.user.email,
			createdAt: new Date().toISOString(),
			status: "scheduled",
		};

		const saved = addMeeting(meeting);

		if (!saved) {
			return NextResponse.json(
				{ error: "Failed to save meeting" },
				{ status: 500 }
			);
		}

		// Send email invitations if attendees are provided
		if (attendees && attendees.length > 0) {
			const emailResult = await sendMeetingInvitation(meeting, attendees);
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

		const deleted = deleteMeeting(meetingId);

		if (!deleted) {
			return NextResponse.json(
				{ error: "Failed to delete meeting" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ message: "Meeting deleted successfully" });
	} catch (error) {
		console.error("Error deleting meeting:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
