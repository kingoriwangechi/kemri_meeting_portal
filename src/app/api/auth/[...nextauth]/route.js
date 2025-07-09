// File: /src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Allow only users with @kemri.go.ke email
      if (user.email.endsWith("@kemri.go.ke")) {
        return true;
      }
      return false; // Block access for other domains
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error" // Optional: redirect to error page on failed sign-in
  },
});

export { handler as GET, handler as POST };
