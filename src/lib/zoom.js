import axios from "axios";

const ZOOM_API_BASE_URL = "https://api.zoom.us/v2";

// Validate Zoom credentials
const validateZoomCredentials = () => {
	if (
		!process.env.ZOOM_API_KEY ||
		process.env.ZOOM_API_KEY === "your_zoom_api_key"
	) {
		throw new Error(
			"Zoom API Key not configured. Please add your Zoom API Key to .env.local"
		);
	}
	if (
		!process.env.ZOOM_API_SECRET ||
		process.env.ZOOM_API_SECRET === "your_zoom_api_secret"
	) {
		throw new Error(
			"Zoom API Secret not configured. Please add your Zoom API Secret to .env.local"
		);
	}
	if (
		!process.env.ZOOM_ACCOUNT_ID ||
		process.env.ZOOM_ACCOUNT_ID === "your_zoom_account_id"
	) {
		throw new Error(
			"Zoom Account ID not configured. Please add your Zoom Account ID to .env.local"
		);
	}
};

// Function to generate a JWT token for Zoom API authentication
const generateZoomJWT = async () => {
	try {
		validateZoomCredentials();

		const response = await axios.post("https://zoom.us/oauth/token", null, {
			params: {
				grant_type: "account_credentials",
				account_id: process.env.ZOOM_ACCOUNT_ID,
			},
			auth: {
				username: process.env.ZOOM_API_KEY,
				password: process.env.ZOOM_API_SECRET,
			},
		});
		return response.data.access_token;
	} catch (error) {
		console.error(
			"Error generating Zoom JWT:",
			error.response?.data || error.message
		);
		if (error.response?.status === 401) {
			throw new Error(
				"Invalid Zoom credentials. Please check your API Key and Secret."
			);
		}
		throw new Error(
			error.message || "Failed to generate Zoom authentication token"
		);
	}
};

// Create a Zoom meeting
export const createZoomMeeting = async ({
	topic,
	startTime,
	duration,
	agenda,
	settings = {},
}) => {
	try {
		validateZoomCredentials();

		const token = await generateZoomJWT();
		const response = await axios.post(
			`${ZOOM_API_BASE_URL}/users/me/meetings`,
			{
				topic,
				type: 2, // Scheduled meeting
				start_time: startTime,
				duration, // in minutes
				timezone: "Africa/Nairobi", // Using Nairobi timezone for KEMRI
				agenda,
				settings: {
					host_video: true,
					participant_video: true,
					join_before_host: false,
					mute_upon_entry: true,
					waiting_room: true,
					meeting_authentication: false,
					...settings,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Get meeting invitation details using the new scope
		const invitationResponse = await axios.get(
			`${ZOOM_API_BASE_URL}/meetings/${response.data.id}/invitation`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		return {
			...response.data,
			invitation: invitationResponse.data.invitation,
		};
	} catch (error) {
		console.error(
			"Error creating Zoom meeting:",
			error.response?.data || error.message
		);
		if (error.response?.status === 401) {
			throw new Error(
				"Failed to authenticate with Zoom. Please check your credentials."
			);
		}
		if (error.response?.status === 404) {
			throw new Error(
				"Zoom user not found. Please check your account settings."
			);
		}
		throw new Error(error.message || "Failed to create Zoom meeting");
	}
};

// Get meeting details including invitation
export const getZoomMeeting = async (meetingId) => {
	try {
		validateZoomCredentials();

		const token = await generateZoomJWT();
		const [meetingResponse, invitationResponse] = await Promise.all([
			axios.get(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}),
			axios.get(`${ZOOM_API_BASE_URL}/meetings/${meetingId}/invitation`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}),
		]);

		return {
			...meetingResponse.data,
			invitation: invitationResponse.data.invitation,
		};
	} catch (error) {
		console.error(
			"Error fetching Zoom meeting:",
			error.response?.data || error.message
		);
		if (error.response?.status === 404) {
			throw new Error("Meeting not found");
		}
		throw new Error(error.message || "Failed to fetch Zoom meeting details");
	}
};

// List all meetings
export const listZoomMeetings = async (params = {}) => {
	try {
		validateZoomCredentials();

		const token = await generateZoomJWT();
		const response = await axios.get(`${ZOOM_API_BASE_URL}/users/me/meetings`, {
			params: {
				type: "scheduled",
				page_size: 30,
				...params,
			},
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error(
			"Error listing Zoom meetings:",
			error.response?.data || error.message
		);
		throw new Error(error.message || "Failed to list Zoom meetings");
	}
};

// Delete a Zoom meeting
export const deleteZoomMeeting = async (meetingId) => {
	try {
		validateZoomCredentials();

		const token = await generateZoomJWT();
		await axios.delete(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		return true;
	} catch (error) {
		console.error(
			"Error deleting Zoom meeting:",
			error.response?.data || error.message
		);
		if (error.response?.status === 404) {
			// If the meeting doesn't exist, consider it successfully deleted
			return true;
		}
		throw new Error(error.message || "Failed to delete Zoom meeting");
	}
};

// Update a Zoom meeting
export const updateZoomMeeting = async (
	meetingId,
	{ topic, startTime, duration, agenda, settings = {} }
) => {
	try {
		validateZoomCredentials();

		const token = await generateZoomJWT();
		const updateResponse = await axios.patch(
			`${ZOOM_API_BASE_URL}/meetings/${meetingId}`,
			{
				topic,
				start_time: startTime,
				...(duration && { duration }), // Only include if provided
				...(agenda && { agenda }), // Only include if provided
				...(Object.keys(settings).length > 0 && { settings }), // Only include if provided
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Get updated meeting details and invitation
		const updatedMeeting = await getZoomMeeting(meetingId);

		return updatedMeeting;
	} catch (error) {
		console.error(
			"Error updating Zoom meeting:",
			error.response?.data || error.message
		);
		if (error.response?.status === 404) {
			throw new Error("Meeting not found");
		}
		throw new Error(error.message || "Failed to update Zoom meeting");
	}
};
