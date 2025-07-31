// Simple script to test Node.js and package.json configuration
// Run with: node check-environment.js

console.log("Environment Check for KEMRI Meeting Portal");
console.log("-----------------------------------------");

// Check Node.js version
console.log(`Node.js version: ${process.version}`);

// Check npm version
try {
	const { execSync } = require("child_process");
	const npmVersion = execSync("npm --version").toString().trim();
	console.log(`npm version: ${npmVersion}`);
} catch (error) {
	console.log("Error getting npm version:", error.message);
}

// Check package.json
try {
	const packageJson = require("./package.json");
	console.log("\nPackage Information:");
	console.log(`Name: ${packageJson.name}`);
	console.log(`Version: ${packageJson.version}`);
	console.log("\nDependencies:");

	for (const [name, version] of Object.entries(
		packageJson.dependencies || {}
	)) {
		console.log(`- ${name}: ${version}`);
	}

	console.log("\nDev Dependencies:");
	for (const [name, version] of Object.entries(
		packageJson.devDependencies || {}
	)) {
		console.log(`- ${name}: ${version}`);
	}

	console.log("\nScripts:");
	for (const [name, script] of Object.entries(packageJson.scripts || {})) {
		console.log(`- ${name}: ${script}`);
	}
} catch (error) {
	console.log("Error reading package.json:", error.message);
}

// Check Next.js config
try {
	const fs = require("fs");
	const nextConfigPath = "./next.config.mjs";
	if (fs.existsSync(nextConfigPath)) {
		console.log("\nNext.js config file exists");
	} else {
		console.log("\nNext.js config file NOT found");
	}
} catch (error) {
	console.log("Error checking Next.js config:", error.message);
}

// Check project structure
try {
	const fs = require("fs");
	const path = require("path");

	console.log("\nProject Structure:");

	const dirs = ["./src", "./src/app", "./src/components", "./public"];

	for (const dir of dirs) {
		if (fs.existsSync(dir)) {
			console.log(`✅ ${dir} exists`);
		} else {
			console.log(`❌ ${dir} MISSING`);
		}
	}

	// Check important files
	const files = [
		"./src/app/layout.js",
		"./src/app/page.js",
		"./postcss.config.mjs",
		"./tailwind.config.js",
	];

	for (const file of files) {
		if (fs.existsSync(file)) {
			console.log(`✅ ${file} exists`);
		} else {
			console.log(`❌ ${file} MISSING`);
		}
	}
} catch (error) {
	console.log("Error checking project structure:", error.message);
}

console.log("\nEnvironment check complete");
