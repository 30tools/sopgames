import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport = {
	themeColor: "#0a0a0a",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export const metadata: Metadata = {
	metadataBase: new URL('https://sopgames.30tools.com'),
	title: "SOP Games | Top Free Online Games",
	description: "Play thousands of free online games instantly. Cinematic experience, no downloads.",
	openGraph: {
		title: "SOP Games | Top Free Online Games",
		description: "Play thousands of free online games instantly. Cinematic experience, no downloads.",
		type: "website",
		siteName: "SOP Games",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "SOP Games",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
