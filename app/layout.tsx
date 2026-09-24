import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getWebsiteSettings } from "@/lib/site-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();

  return {
    title: settings.website_title,
    description: settings.seo_description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getWebsiteSettings();

  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen">
        <Navbar
          companyName={settings.company_name}
          slogan={settings.slogan}
        />

        {children}

        <Footer
          companyName={settings.company_name}
          footerText={settings.footer_text}
          linkedinUrl={settings.linkedin_url}
          facebookUrl={settings.facebook_url}
          instagramUrl={settings.instagram_url}
          twitterUrl={settings.twitter_url}
          youtubeUrl={settings.youtube_url}
        />
      </body>
    </html>
  );
}