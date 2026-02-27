import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

// Debug NextAuth configuration (only in development)
if (process.env.NODE_ENV === "development") {
	console.log("NextAuth Config - NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
	console.log("NextAuth Config - Google ID exists:", !!process.env.GOOGLE_ID);
	console.log(
		"NextAuth Config - Google Secret exists:",
		!!process.env.GOOGLE_SECRET,
	);
}

// Create an array of providers based on available environment variables
const providers = [];

// Add Google provider if credentials are available
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
	providers.push(
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: "select_account",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	);
}

// Add Azure AD provider if credentials are available
if (
	process.env.AZURE_AD_CLIENT_ID &&
	process.env.AZURE_AD_CLIENT_SECRET &&
	process.env.AZURE_AD_TENANT_ID
) {
	providers.push(
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			tenantId: process.env.AZURE_AD_TENANT_ID,
			authorization: {
				params: {
					// Request OpenID Connect and Microsoft Graph scopes for Teams meeting creation
					scope: "openid profile email https://graph.microsoft.com/.default",
					// Optimize prompt to skip account selection for faster sign-in
					prompt:
						process.env.NODE_ENV === "production"
							? "select_account"
							: "select_account",
				},
			},
			profile(profile) {
				return {
					id: profile.sub || profile.oid,
					name: profile.name || profile.given_name || "",
					email: profile.preferred_username || profile.email || "",
					image: null,
				};
			},
		}),
	);
}

// Always add Credentials provider as fallback
providers.push(
	CredentialsProvider({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "email" },
			password: { label: "Password", type: "password" },
		},
		async authorize(credentials) {
			// This is a temporary authentication - replace with database check later
			if (credentials.email && credentials.password) {
				// For demo purposes, accept any non-empty email/password
				const user = {
					id: "1",
					email: credentials.email,
					name: credentials.email.split("@")[0],
				};
				if (process.env.NODE_ENV === "development") {
					console.log("Credentials auth successful for:", credentials.email);
				}
				return user;
			}
			if (process.env.NODE_ENV === "development") {
				console.log("Credentials auth failed for:", credentials.email);
			}
			return null;
		},
	}),
);

export const authOptions = {
	debug: process.env.NODE_ENV === "development", // Only debug in development
	useSecureCookies: process.env.NODE_ENV === "production",
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // Update every 24 hours
	},
	cookies: {
		sessionToken: {
			name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
			options: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
			},
		},
	},
	providers,
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			// Allow all providers to sign in
			return true;
		},
		async redirect({ url, baseUrl }) {
			// Always redirect to dashboard on successful sign-in
			if (url === baseUrl) {
				return `${baseUrl}/dashboard`;
			}

			// If it's an internal URL, allow it
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`;
			}

			// If it starts with the baseUrl, it's safe
			if (url.startsWith(baseUrl)) {
				return url;
			}

			// Default to dashboard
			return `${baseUrl}/dashboard`;
		},
		async session({ session, token }) {
			if (session?.user) {
				// Attach provider and token info to session
				session.user.provider = token.provider;

				// Only attach tokens if they exist
				if (token.accessToken) {
					session.user.accessToken = token.accessToken;
					session.user.refreshToken = token.refreshToken;
					session.user.tokenExpires = token.tokenExpires;
				}
			}
			return session;
		},
		async jwt({ token, account, profile, user }) {
			// On initial sign-in
			if (account && profile) {
				token.provider = account.provider;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
				token.tokenExpires = account.expires_at;
			}
			// On subsequent calls, preserve the token
			return token;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
