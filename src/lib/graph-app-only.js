/**
 * Utility for acquiring app-only tokens from Azure AD using client credentials flow.
 * Use this for server-to-server (background) Graph operations that don't require user context.
 *
 * Example permissions: User.Read.All, Mail.Send, etc. (application permissions in Azure)
 */

import { ConfidentialClientApplication } from "@azure/msal-node";

let msalInstance = null;

function getMsalInstance() {
	if (!msalInstance) {
		const config = {
			auth: {
				clientId: process.env.AZURE_AD_CLIENT_ID,
				authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
				clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			},
		};

		msalInstance = new ConfidentialClientApplication(config);
	}

	return msalInstance;
}

/**
 * Acquire an app-only access token for Microsoft Graph.
 * @returns {string} Access token
 */
export async function getAppOnlyToken() {
	const msal = getMsalInstance();

	const tokenRequest = {
		scopes: ["https://graph.microsoft.com/.default"],
	};

	try {
		const response = await msal.acquireTokenByClientCredential(tokenRequest);
		return response.accessToken;
	} catch (error) {
		console.error("Error acquiring app-only token:", error);
		throw error;
	}
}

/**
 * Helper to call Microsoft Graph with app-only token.
 * @param {string} graphUrl - Full Microsoft Graph API URL
 * @param {string} method - HTTP method (GET, POST, PATCH, DELETE)
 * @param {object} data - Request body (optional)
 * @returns {Promise<any>} API response
 */
export async function callGraphAPI(graphUrl, method = "GET", data = null) {
	const token = await getAppOnlyToken();

	const options = {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(graphUrl, options);

		if (!response.ok) {
			const error = await response.json();
			console.error("Graph API error:", error);
			throw new Error(JSON.stringify(error));
		}

		return await response.json();
	} catch (error) {
		console.error("Graph API call failed:", error.message);
		throw error;
	}
}
