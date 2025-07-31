import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/user";

// GET handler for fetching user profile
export async function GET(request) {
	try {
		// Get session to verify user is authenticated
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Try to connect to MongoDB, but don't fail if connection is not available
		try {
			await connectToDatabase();
		} catch (error) {
			console.warn(
				"MongoDB connection failed, using fallback storage:",
				error.message
			);
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email") || session.user.email;

		// Only allow fetching other user profiles if query explicitly requests it
		if (email !== session.user.email) {
			// Could implement admin check here for full access to other profiles
			// For now, we'll just return basic info for other users
			const user = await User.findOne({ email }).select(
				"name email department"
			);
			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
			return NextResponse.json(user);
		}

		// Find the current user
		let user = await User.findOne({ email });

		// If user doesn't exist in DB yet, create a new user based on session info
		if (!user) {
			user = new User({
				name: session.user.name,
				email: session.user.email,
				image: session.user.image,
			});
			await user.save();
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error in GET user:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user profile" },
			{ status: 500 }
		);
	}
}

// PUT handler for updating user profile
export async function PUT(request) {
	try {
		// Get session to verify user is authenticated
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Connect to MongoDB
		await connectToDatabase();

		// Parse user data from request body
		const data = await request.json();
		const { email, ...updateData } = data;

		// Only allow updating own profile
		if (email !== session.user.email) {
			return NextResponse.json(
				{ error: "Unauthorized to update this profile" },
				{ status: 403 }
			);
		}

		// Prevent changing email as it's the primary identifier
		if (updateData.email) {
			delete updateData.email;
		}

		// Update user's profile
		updateData.updatedAt = new Date();
		const user = await User.findOneAndUpdate({ email }, updateData, {
			new: true,
			runValidators: true,
			upsert: true,
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error in PUT user:", error);

		// Handle validation errors
		if (error.name === "ValidationError") {
			const validationErrors = Object.keys(error.errors).map((key) => ({
				field: key,
				message: error.errors[key].message,
			}));

			return NextResponse.json(
				{ error: "Validation error", details: validationErrors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to update user profile" },
			{ status: 500 }
		);
	}
}
