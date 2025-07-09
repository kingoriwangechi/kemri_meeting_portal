import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error",
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			// Restrict access to @kemri.go.ke email addresses only
			if (user?.email?.endsWith("@kemri.go.ke")) {
				return true;
			}
			return false;
		},
		async session({ session, token }) {
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
});

export { handler as GET, handler as POST };
