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
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function GET() {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const meetings = getMeetings();
	return NextResponse.json(meetings);
}

export async function POST(request) {
	const session = await getServerSession(authOptions);

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

		// Create Zoom or Teams meeting based on platform
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
					{ status: 500 },
				);
			}
		} else if (platform === "teams" && !meetingLink) {
			try {
				// Check if user has Microsoft Teams access token
				if (!session?.user?.accessToken) {
					return NextResponse.json(
						{
							error:
								"Teams meeting creation requires signing in with Microsoft. Please sign out and sign in with your Microsoft account to create Teams meetings.",
						},
						{ status: 401 },
					);
				}

				console.log("Creating Teams meeting for platform: teams");
				console.log("User has access token:", !!session?.user?.accessToken);

				// Create Teams meeting using Microsoft Graph
				const teamsMeeting = await createTeamsMeeting(
					session,
					title,
					description,
					dateTime,
					attendees,
				);
				finalMeetingLink = teamsMeeting.joinWebUrl;
			} catch (error) {
				console.error("Error creating Teams meeting:", error.message);
				console.error("Full error:", error);
				// Log the error but don't fail - allow meeting creation without Teams link
				console.warn(
					"Teams meeting auto-generation failed, continuing without Teams link",
				);
				// Don't return error - let the meeting be created without a link
				// This allows users to manually add the link later
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
				{ status: 500 },
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
			{ status: 500 },
		);
	}
}

export async function DELETE(request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const meetingId = searchParams.get("id");

		if (!meetingId) {
			return NextResponse.json(
				{ error: "Meeting ID required" },
				{ status: 400 },
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
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting meeting:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

/**
 * Helper function to create a Teams meeting via Microsoft Graph API
 */
async function createTeamsMeeting(
	session,
	title,
	description,
	dateTime,
	attendees = [],
) {
	if (!session?.user?.accessToken) {
		throw new Error("No access token available for Teams meeting creation");
	}

	console.log("Creating Teams meeting with:", { title, dateTime, attendees });

	// Parse the dateTime (format: YYYY-MM-DDTHH:mm:ss)
	const startDateTime = new Date(dateTime);
	// Add 1 hour for end time
	const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

	console.log("Teams meeting times:", {
		startDateTime: startDateTime.toISOString(),
		endDateTime: endDateTime.toISOString(),
	});

	const payload = {
		subject: title,
		startDateTime: startDateTime.toISOString(),
		endDateTime: endDateTime.toISOString(),
		isReminderOn: true,
		reminderMinutesBeforeStart: 15,
		allowNewTimeProposals: true,
	};

	// Add attendees if provided
	if (attendees && attendees.length > 0) {
		payload.attendees = attendees.map((email) => ({
			emailAddress: {
				address: email,
			},
			type: "required",
		}));
	}

	console.log("Teams meeting payload:", payload);

	try {
		const response = await axios.post(
			"https://graph.microsoft.com/v1.0/me/onlineMeetings",
			payload,
			{
				headers: {
					Authorization: `Bearer ${session.user.accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		console.log("Teams meeting created successfully:", response.data);
		return response.data;
	} catch (error) {
		const statusCode = error.response?.status;
		const errorDetails = error.response?.data;

		console.error("Teams Graph API error status:", statusCode);
		console.error("Teams Graph API error details:", errorDetails);
		console.error("Teams Graph API error message:", error.message);

		// Handle 403 Forbidden - missing permissions
		if (statusCode === 403) {
			throw new Error(
				"Permission denied. Your Azure AD app needs 'OnlineMeetings.ReadWrite' permission. " +
					"Or you need to sign out and sign back in to get the required permissions. " +
					`(Error: ${errorDetails?.error?.message || "Insufficient permissions"})`,
			);
		}

		// Handle other errors
		throw new Error(
			errorDetails?.error?.message ||
				error.message ||
				"Failed to create Teams meeting",
		);
	}
}
