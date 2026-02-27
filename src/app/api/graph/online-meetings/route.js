import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

/**
 * GET /api/graph/online-meetings
 * Fetch OnlineMeetings from Microsoft Graph (requires delegated permission)
 */
export async function GET(request) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.accessToken) {
		return NextResponse.json(
			{ error: "Unauthorized or no access token" },
			{ status: 401 },
		);
	}

	try {
		const response = await axios.get(
			"https://graph.microsoft.com/v1.0/me/onlineMeetings",
			{
				headers: {
					Authorization: `Bearer ${session.user.accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		console.error("Graph API error:", error.response?.data || error.message);
		return NextResponse.json(
			{
				error: "Failed to fetch meetings",
				details: error.response?.data,
			},
			{ status: error.response?.status || 500 },
		);
	}
}

/**
 * POST /api/graph/online-meetings
 * Create a new Teams OnlineMeeting (requires delegated permission: OnlineMeetings.ReadWrite)
 */
export async function POST(request) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.accessToken) {
		return NextResponse.json(
			{ error: "Unauthorized or no access token" },
			{ status: 401 },
		);
	}

	try {
		const body = await request.json();
		const {
			subject,
			startDateTime,
			endDateTime,
			attendees = [],
			isReminderOn = true,
			reminderMinutesBeforeStart = 15,
		} = body;

		if (!subject || !startDateTime || !endDateTime) {
			return NextResponse.json(
				{
					error: "Missing required fields: subject, startDateTime, endDateTime",
				},
				{ status: 400 },
			);
		}

		const payload = {
			subject,
			startDateTime: new Date(startDateTime).toISOString(),
			endDateTime: new Date(endDateTime).toISOString(),
			isReminderOn,
			reminderMinutesBeforeStart,
			allowNewTimeProposals: true,
		};

		// Add attendees if provided
		if (attendees.length > 0) {
			payload.attendees = attendees.map((email) => ({
				emailAddress: { address: email },
				type: "required",
			}));
		}

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

		return NextResponse.json(response.data, { status: 201 });
	} catch (error) {
		console.error("Graph API error:", error.response?.data || error.message);
		return NextResponse.json(
			{
				error: "Failed to create meeting",
				details: error.response?.data,
			},
			{ status: error.response?.status || 500 },
		);
	}
}
