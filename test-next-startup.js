// Script to test the Next.js startup process
// Run with: node test-next-startup.js

const { spawn } = require("child_process");
const fs = require("fs");

console.log("Testing Next.js startup...");

// Create a temporary next.config.js file for testing
const tempConfig = `
module.exports = {
  // Minimal configuration
  reactStrictMode: true,
}
`;

try {
	fs.writeFileSync("./temp-next.config.js", tempConfig);
	console.log("Created temporary Next.js config");

	// Run Next.js with the temporary config
	const nextProcess = spawn(
		"npx",
		["next", "dev", "-p", "3002", "--config", "./temp-next.config.js"],
		{
			shell: true,
			stdio: "pipe",
		}
	);

	console.log("Started Next.js process");

	// Listen for data from stdout
	nextProcess.stdout.on("data", (data) => {
		const output = data.toString();
		console.log(`[Next.js stdout]: ${output}`);

		// If we see the server started message, kill the process
		if (output.includes("started server") || output.includes("ready in")) {
			console.log("\nNext.js started successfully! Stopping test process.");
			nextProcess.kill();
		}
	});

	// Listen for data from stderr
	nextProcess.stderr.on("data", (data) => {
		console.error(`[Next.js stderr]: ${data.toString()}`);
	});

	// Listen for process exit
	nextProcess.on("close", (code) => {
		console.log(`Next.js process exited with code ${code}`);

		// Clean up the temporary config
		try {
			fs.unlinkSync("./temp-next.config.js");
			console.log("Removed temporary Next.js config");
		} catch (err) {
			console.error("Failed to clean up temporary config:", err);
		}

		if (code !== null && code !== 0 && code !== 143 /* SIGTERM */) {
			console.error("Next.js failed to start properly");
		}
	});

	// Set a timeout to kill the process after 30 seconds if it's still running
	setTimeout(() => {
		if (nextProcess.killed === false) {
			console.log("Test timeout reached. Stopping Next.js process.");
			nextProcess.kill();
		}
	}, 30000);
} catch (error) {
	console.error("Error during testing:", error);

	// Try to clean up the temporary config if it exists
	try {
		if (fs.existsSync("./temp-next.config.js")) {
			fs.unlinkSync("./temp-next.config.js");
			console.log("Cleaned up temporary Next.js config");
		}
	} catch (err) {
		console.error("Failed to clean up temporary config:", err);
	}
}
