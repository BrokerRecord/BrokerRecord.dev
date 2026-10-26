import type { Metadata, Viewport } from "next";
import "./globals.css";
export const viewport: Viewport = { themeColor: "#13111B", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };
export const metadata: Metadata = {
  metadataBase: new URL("https://awambaye.com"),
  title: { default: "Awa Mbaye | R&D Engineer · AI · Data Science", template: "%s | Awa Mbaye" },
  description: "Portfolio of Awa Mbaye, R&D engineer in Nantes, France. AI, medical imaging, Python, data science and applied research.",
  openGraph: { type: "website", siteName: "Awa Mbaye", title: "Awa Mbaye | R&D Engineer", description: "AI · Data Science · Python · Applied Research", url: "https://awambaye.com", images: ["/profile.jpg"] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
