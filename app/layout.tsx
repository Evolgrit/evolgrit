import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://evolgrit.com"),
  title: {
    default: "Evolgrit – AI-powered German learning & job readiness for international talent",
    template: "%s | Evolgrit",
  },
  description:
    "Evolgrit prepares international talent for Germany with AI-powered German learning, cultural readiness, and employer matching.",
  openGraph: {
    type: "website",
    url: "https://evolgrit.com",
    siteName: "Evolgrit",
    title: "Evolgrit – AI-powered German learning & job readiness for international talent",
    description:
      "AI-powered German learning, cultural readiness, and job preparation — so international talent can truly arrive and stay in Germany.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolgrit",
    description:
      "AI-powered German learning, cultural readiness, and job preparation for international talent in Germany.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon-32.png",
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        {children}
      </body>
    </html>
  );
}
