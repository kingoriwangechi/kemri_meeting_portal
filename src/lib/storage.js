import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const MEETINGS_FILE = path.join(DATA_DIR, "meetings.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
	fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize meetings file if it doesn't exist
if (!fs.existsSync(MEETINGS_FILE)) {
	fs.writeFileSync(MEETINGS_FILE, JSON.stringify([]));
}

export const getMeetings = () => {
	try {
		const data = fs.readFileSync(MEETINGS_FILE, "utf8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading meetings:", error);
		return [];
	}
};

export const saveMeetings = (meetings) => {
	try {
		fs.writeFileSync(MEETINGS_FILE, JSON.stringify(meetings, null, 2));
		return true;
	} catch (error) {
		console.error("Error saving meetings:", error);
		return false;
	}
};

export const addMeeting = (meeting) => {
	const meetings = getMeetings();
	meetings.push(meeting);
	return saveMeetings(meetings);
};

export const deleteMeeting = (meetingId) => {
	const meetings = getMeetings();
	const updatedMeetings = meetings.filter(
		(meeting) => meeting.id !== meetingId
	);
	return saveMeetings(updatedMeetings);
};

export const updateMeeting = (updatedMeeting) => {
	const meetings = getMeetings();
	const updatedMeetings = meetings.map((meeting) =>
		meeting.id === updatedMeeting.id ? updatedMeeting : meeting
	);
	return saveMeetings(updatedMeetings);
};

export const getMeetingById = (meetingId) => {
	const meetings = getMeetings();
	return meetings.find((meeting) => meeting.id === meetingId);
};
