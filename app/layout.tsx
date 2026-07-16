import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "BrandMint AI | Premium Venture Building & Business Systems",
    template: "%s | BrandMint AI",
  },
  description: "Digital ecosystem covering venture building, business systems, automation, and IP products with quantum-weaving integration.",
  keywords: ["venture building", "AI automation", "business systems", "digital ecosystem", "BrandMint"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text selection:bg-accent-mid/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
