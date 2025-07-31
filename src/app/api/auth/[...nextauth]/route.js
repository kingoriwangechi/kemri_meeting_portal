import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

// Debug NextAuth configuration
console.log("NextAuth Config - NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NextAuth Config - Google ID exists:", !!process.env.GOOGLE_ID);
console.log(
	"NextAuth Config - Google Secret exists:",
	!!process.env.GOOGLE_SECRET
);

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
		})
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
			authorization: { params: { scope: "openid profile email" } },
			profile(profile) {
				console.log("Microsoft profile:", profile);
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.preferred_username || profile.email,
					image: null,
				};
			},
		})
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
			console.log("Credentials auth attempt for:", credentials.email);

			// This is a temporary authentication - replace with database check later
			if (credentials.email && credentials.password) {
				// For demo purposes, accept any non-empty email/password
				const user = {
					id: "1",
					email: credentials.email,
					name: credentials.email.split("@")[0],
				};
				console.log("Credentials auth successful for:", credentials.email);
				return user;
			}
			console.log("Credentials auth failed for:", credentials.email);
			return null;
		},
	})
);

const handler = NextAuth({
	debug: true, // Enable debug mode
	useSecureCookies: process.env.NODE_ENV === "production",
	cookies: {
		callbackUrl: {
			// This ensures that the callback URL cookie is accessible from client-side JavaScript
			options: { sameSite: "lax", path: "/" },
		},
	},
	providers,
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			console.log("Sign-in attempt:", {
				provider: account.provider,
				email: profile?.email || user?.email,
				name: profile?.name || user?.name,
			});

			if (account.provider === "google") {
				// Log more details for debugging
				console.log("Google sign-in details:", {
					id: profile.sub,
					email: profile.email,
					name: profile.name,
					verified: profile.email_verified,
				});
				return true; // Allow all Google sign-ins
			}

			if (account.provider === "azure-ad") {
				console.log("Microsoft sign-in details:", {
					id: profile.sub,
					email: profile.preferred_username || profile.email,
					name: profile.name,
				});
				return true; // Allow all Microsoft sign-ins
			}

			return true;
		},
		async redirect({ url, baseUrl }) {
			console.log("Redirect callback:", { url, baseUrl });
			// Ensure the redirect URL is allowed
			if (url.startsWith(baseUrl)) return url;
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			return baseUrl;
		},
		async session({ session, token }) {
			console.log("Session callback:", { user: session?.user?.email });
			return session;
		},
		async jwt({ token, account, profile }) {
			// Initial sign in
			if (account && profile) {
				console.log("JWT callback - new sign in:", {
					provider: account.provider,
				});
			}
			return token;
		},
	},
});

export { handler as GET, handler as POST };
