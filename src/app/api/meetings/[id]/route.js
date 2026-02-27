import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getMeetingById, updateMeeting } from "@/lib/storage";
import { sendMeetingInvitation } from "@/lib/email";
import {
	updateZoomMeeting,
	createZoomMeeting,
	deleteZoomMeeting,
} from "@/lib/zoom";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

export async function GET(request, { params }) {
	const session = await getServerSession(authOptions);

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
	const session = await getServerSession(authOptions);

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
						{ status: 500 },
					);
				}
			}
		} else if (platform === "teams" && !meetingLink) {
			// Create Teams meeting
			try {
				if (!session?.user?.accessToken) {
					return NextResponse.json(
						{
							error:
								"Teams meeting creation requires signing in with Microsoft.",
						},
						{ status: 401 },
					);
				}

				const teamsMeeting = await createTeamsMeeting(
					session,
					title,
					description,
					dateTime,
					attendees,
				);
				finalMeetingLink = teamsMeeting.joinWebUrl;
			} catch (error) {
				console.error("Error creating Teams meeting:", error);
				// Log the error but don't fail - allow meeting update without Teams link
				console.warn(
					"Teams meeting auto-generation failed, continuing without Teams link",
				);
				// Don't return error - let the meeting be updated without a link
				// This allows users to manually add the link later
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
				{ status: 500 },
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
