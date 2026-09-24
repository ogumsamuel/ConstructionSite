type FooterProps = {
  companyName: string;
  footerText: string;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
};

export default function Footer({
  companyName,
  footerText,
  linkedinUrl,
  facebookUrl,
  instagramUrl,
  twitterUrl,
  youtubeUrl,
}: FooterProps) {
  const socialLinks = [
    linkedinUrl
      ? {
          name: "LinkedIn",
          href: linkedinUrl,
          label: "in",
        }
      : null,

    facebookUrl
      ? {
          name: "Facebook",
          href: facebookUrl,
          label: "f",
        }
      : null,

    instagramUrl
      ? {
          name: "Instagram",
          href: instagramUrl,
          label: "◎",
        }
      : null,

    twitterUrl
      ? {
          name: "X",
          href: twitterUrl,
          label: "𝕏",
        }
      : null,

      
    youtubeUrl
      ? {
          name: "YouTube",
          href: youtubeUrl,
          label: "▶️",
        }
      : null,
  ].filter(Boolean) as {
    name: string;
    href: string;
    label: string;
  }[];

  return (
    <footer className="border-t border-white/10 bg-blue-900 text-white">
      <div className="bg-slate-900 py-20 sm:py-24">
        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-white/80 sm:text-base">
            {footerText || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
          </p>
        </div>

        {/* Social Networks */}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${companyName} on ${social.name}`}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm font-extrabold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-blue-900"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}