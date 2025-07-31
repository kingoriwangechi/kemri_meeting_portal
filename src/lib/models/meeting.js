import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please provide a title for this meeting"],
		maxlength: [100, "Title cannot be more than 100 characters"],
	},
	description: {
		type: String,
	},
	date: {
		type: Date,
		required: [true, "Please provide a date for this meeting"],
	},
	startTime: {
		type: String,
		required: [true, "Please provide a start time for this meeting"],
	},
	endTime: {
		type: String,
		required: [true, "Please provide an end time for this meeting"],
	},
	timezone: {
		type: String,
		default: "Africa/Nairobi",
	},
	duration: {
		type: Number, // Duration in minutes
		required: [true, "Please provide a duration for this meeting"],
		min: [1, "Duration must be at least 1 minute"],
	},
	isRecurring: {
		type: Boolean,
		default: false,
	},
	recurringType: {
		type: String,
		enum: ["daily", "weekly", "monthly", null],
		default: null,
	},
	recurringInterval: {
		type: Number,
		default: null,
	},
	recurringEndDate: {
		type: Date,
		default: null,
	},
	location: {
		type: String,
		default: "Online",
	},
	meetingLink: {
		type: String,
	},
	meetingIdType: {
		type: String,
		enum: ["generate", "personal"],
		default: "generate",
	},
	personalMeetingId: {
		type: String,
	},
	templateType: {
		type: String,
		default: "default",
	},
	withWhiteboard: {
		type: Boolean,
		default: false,
	},
	withDocs: {
		type: Boolean,
		default: false,
	},
	passcode: {
		type: String,
	},
	enableWaitingRoom: {
		type: Boolean,
		default: true,
	},
	enableMeetingChat: {
		type: Boolean,
		default: true,
	},
	hostVideo: {
		type: Boolean,
		default: true,
	},
	participantVideo: {
		type: Boolean,
		default: false,
	},
	allowJoinAnytime: {
		type: Boolean,
		default: false,
	},
	muteParticipants: {
		type: Boolean,
		default: true,
	},
	autoRecord: {
		type: Boolean,
		default: false,
	},
	allowedRegions: {
		type: String,
		default: "global",
	},
	organizer: {
		type: String,
		required: [true, "Please provide an organizer for this meeting"],
	},
	organizerId: {
		type: String,
		required: [true, "Please provide an organizer ID for this meeting"],
	},
	attendees: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	department: {
		type: String,
		default: "General",
	},
	status: {
		type: String,
		enum: ["scheduled", "completed", "cancelled"],
		default: "scheduled",
	},
});

export default mongoose.models.Meeting ||
	mongoose.model("Meeting", MeetingSchema);
