import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata = {
	title: "KEMRI Meeting Portal",
	description: "Kenya Medical Research Institute Meeting Portal",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased`}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
