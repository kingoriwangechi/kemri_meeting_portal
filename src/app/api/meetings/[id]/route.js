import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getMeetingById, updateMeeting } from "@/lib/storage";
import { sendMeetingInvitation } from "@/lib/email";
import {
	updateZoomMeeting,
	createZoomMeeting,
	deleteZoomMeeting,
} from "@/lib/zoom";

export async function GET(request, { params }) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const meetingId = params.id;
	const meeting = getMeetingById(meetingId);

	if (!meeting) {
		return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
	}

	return NextResponse.json(meeting);
}

export async function PUT(request, { params }) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const meetingId = params.id;
		const existingMeeting = getMeetingById(meetingId);

		if (!existingMeeting) {
			return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
		}

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

		// Handle Zoom meeting updates
		let finalMeetingLink = meetingLink;
		let zoomMeetingId = existingMeeting.zoomMeetingId;
		let zoomInvitation = existingMeeting.zoomInvitation;

		// Handle platform changes
		if (platform === "zoom") {
			if (existingMeeting.platform === "zoom" && zoomMeetingId) {
				// Update existing Zoom meeting
				try {
					if (typeof updateZoomMeeting === "function") {
						const updatedZoomMeeting = await updateZoomMeeting(zoomMeetingId, {
							topic: title,
							startTime: dateTime,
							agenda: description,
						});
						finalMeetingLink = updatedZoomMeeting.join_url;
						zoomInvitation = updatedZoomMeeting.invitation;
					}
				} catch (error) {
					console.error("Error updating Zoom meeting:", error);
				}
			} else if (!meetingLink) {
				// Create new Zoom meeting (switching from Teams or adding Zoom)
				try {
					const zoomMeeting = await createZoomMeeting({
						topic: title,
						startTime: dateTime,
						duration: 60,
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
		} else if (
			existingMeeting.platform === "zoom" &&
			platform !== "zoom" &&
			zoomMeetingId
		) {
			// Platform changed from Zoom to something else, delete Zoom meeting
			try {
				await deleteZoomMeeting(zoomMeetingId);
				zoomMeetingId = null;
				zoomInvitation = null;
			} catch (error) {
				console.error("Error deleting old Zoom meeting:", error);
			}
		}

		// Update the meeting object
		const updatedMeeting = {
			...existingMeeting,
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
			updatedAt: new Date().toISOString(),
		};

		const saved = updateMeeting(updatedMeeting);

		if (!saved) {
			return NextResponse.json(
				{ error: "Failed to update meeting" },
				{ status: 500 }
			);
		}

		// Send updated email invitations if needed
		if (isRestrictive && attendees && attendees.length > 0) {
			const emailContent =
				platform === "zoom" && zoomInvitation ? zoomInvitation : updatedMeeting;

			const emailResult = await sendMeetingInvitation(emailContent, attendees);
			if (!emailResult.success) {
				console.error("Failed to send email invitations:", emailResult.error);
			}
		}

		return NextResponse.json(updatedMeeting);
	} catch (error) {
		console.error("Error updating meeting:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
