"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Safety", href: "/safety" },
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

type NavbarProps = {
  companyName: string;
  slogan: string;
};

export default function Navbar({
  companyName,
  slogan,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 flex-1 items-center gap-2.5"
        >
          <div className="relative h-10 w-16 shrink-0 sm:h-12 sm:w-20">
            <Image
              src="/images/company/Logo.jpeg"
              alt={`${companyName} logo`}
              fill
              priority
              className="object-contain object-left"
              sizes="80px"
            />
          </div>

          <div className="min-w-0">
            <p className="max-w-[230px] text-xs font-extrabold leading-tight tracking-tight text-slate-900 sm:text-sm lg:text-base">
              {companyName}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-primary sm:text-xs">
              {slogan}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden shrink-0 items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/quote"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
          className="relative z-[60] flex h-11 w-11 shrink-0 touch-manipulation select-none items-center justify-center rounded-md border border-border bg-white text-slate-800 active:bg-slate-100 lg:hidden"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>

          <span className="flex w-6 flex-col gap-1.5">
            <span
              className={`block h-0.5 w-full bg-current transition-transform duration-200 ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-full bg-current transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`block h-0.5 w-full bg-current transition-transform duration-200 ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="relative z-40 border-t border-border bg-white shadow-lg lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="border-b border-border py-4 text-sm font-semibold text-slate-700 transition-colors active:bg-slate-50 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/quote"
                onClick={closeMenu}
                className="mt-5 rounded-md bg-primary px-5 py-3.5 text-center text-sm font-bold text-white transition-colors active:opacity-90 hover:bg-primary-dark"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}