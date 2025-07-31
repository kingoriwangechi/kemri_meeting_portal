import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name for this user"],
		maxlength: [100, "Name cannot be more than 100 characters"],
	},
	email: {
		type: String,
		required: [true, "Please provide an email for this user"],
		unique: true,
	},
	image: {
		type: String,
	},
	department: {
		type: String,
		default: "General",
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
