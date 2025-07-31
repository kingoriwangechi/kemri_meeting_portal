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
