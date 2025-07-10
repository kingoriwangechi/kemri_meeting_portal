import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
			tenantId: process.env.AZURE_AD_TENANT_ID,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				// This is a temporary authentication - replace with database check later
				if (credentials.email && credentials.password) {
					return {
						id: "1",
						email: credentials.email,
						name: credentials.email.split("@")[0],
					};
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ account, profile }) {
			if (account.provider === "google") {
				return true; // Allow all Google sign-ins
			}
			return true;
		},
		async session({ session, token }) {
			return session;
		},
	},
});

export { handler as GET, handler as POST };
