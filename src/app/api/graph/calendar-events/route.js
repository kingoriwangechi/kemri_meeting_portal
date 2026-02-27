import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

/**
 * GET /api/graph/calendar-events
 * Fetch calendar events from Microsoft Graph (delegated permission)
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
		// Query calendar events for the next 7 days
		const startDate = new Date();
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + 7);

		const response = await axios.get(
			"https://graph.microsoft.com/v1.0/me/calendarview",
			{
				params: {
					startDateTime: startDate.toISOString(),
					endDateTime: endDate.toISOString(),
				},
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
				error: "Failed to fetch calendar events",
				details: error.response?.data,
			},
			{ status: error.response?.status || 500 },
		);
	}
}

/**
 * POST /api/graph/calendar-events
 * Create a calendar event (delegated permission: Calendars.ReadWrite)
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
		const { subject, startDateTime, endDateTime, attendees = [] } = body;

		if (!subject || !startDateTime || !endDateTime) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const payload = {
			subject,
			start: {
				dateTime: new Date(startDateTime).toISOString(),
				timeZone: "UTC",
			},
			end: {
				dateTime: new Date(endDateTime).toISOString(),
				timeZone: "UTC",
			},
			attendees: attendees.map((email) => ({
				emailAddress: { address: email },
				type: "required",
			})),
		};

		const response = await axios.post(
			"https://graph.microsoft.com/v1.0/me/calendar/events",
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
				error: "Failed to create calendar event",
				details: error.response?.data,
			},
			{ status: error.response?.status || 500 },
		);
	}
}
