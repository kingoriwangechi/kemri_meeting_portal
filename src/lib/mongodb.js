import mongoose from "mongoose";

// Default to using a local MongoDB for development if MONGODB_URI is not provided
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/kemri_meeting_portal";

// In production, we'll still warn but not throw an error to prevent deployment failures
// We'll use JSON file storage as fallback (already implemented in the app)
if (!process.env.MONGODB_URI && process.env.NODE_ENV === "production") {
	console.warn("MongoDB URI not defined. Using JSON file storage as fallback.");
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectToDatabase;
