"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, PhoneCall } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Services",
    /** On the home page, scroll to the services preview section. */
    homeHref: "#services",
  },
  { href: "/testimonials", label: "Testimonials" },
];

const actionButtons = [
  {
    href: "/appointment",
    label: "Appointment",
    match: (pathname: string) =>
      pathname.startsWith("/book-appointment") ||
      pathname.startsWith("/appointment"),
    className:
      "border-2 border-swedenblue bg-white text-swedenblue hover:bg-swedenblue hover:text-white hover:shadow-[0_6px_20px_rgba(0,91,153,0.25)]",
  },
  {
    href: "/contact",
    label: "Contact",
    match: (pathname: string) => pathname.startsWith("/contact"),
    className:
      "bg-swedenyellow text-ink hover:bg-swedenyellowDark hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)]",
  },
] as const;

const actionButtonBase =
  "inline-flex w-full md:w-auto items-center justify-center px-5 py-2.5 rounded-full font-semibold text-[0.9rem] transition-all hover:-translate-y-0.5";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] sticky top-0 z-[1000]">
      <div
        className="contact-marquee relative overflow-hidden border-b border-red-800/40 bg-gradient-to-r from-red-800 via-red-600 to-red-800 py-2.5 text-sm text-white"
        aria-label="Contact information"
      >
        <div className="contact-marquee-track">
          <div className="contact-marquee-group">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
              Contact us
            </span>
            <a
              href="mailto:manartanver@gmail.com"
              className="contact-marquee-link"
            >
              <Mail size={15} strokeWidth={2.25} aria-hidden="true" />
              <span className="text-white/75">Email</span>
              <span className="font-semibold">manartanver@gmail.com</span>
            </a>
            <span className="h-4 w-px bg-white/35" aria-hidden="true" />
            <a href="tel:+4634934829382" className="contact-marquee-link">
              <PhoneCall size={15} strokeWidth={2.25} aria-hidden="true" />
              <span className="text-white/75">Call us</span>
              <span className="font-semibold tracking-wide">
                +4634934829382
              </span>
            </a>
          </div>
          <div className="contact-marquee-group" aria-hidden="true">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90">
              Contact us
            </span>
            <span className="contact-marquee-link">
              <Mail size={15} strokeWidth={2.25} />
              <span className="text-white/75">Email</span>
              <span className="font-semibold">manartanver@gmail.com</span>
            </span>
            <span className="h-4 w-px bg-white/35" />
            <span className="contact-marquee-link">
              <PhoneCall size={15} strokeWidth={2.25} />
              <span className="text-white/75">Call us</span>
              <span className="font-semibold tracking-wide">
                +4634934829382
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 max-w-6xl mx-auto relative">
        <Link
          href="/"
          className="text-lg sm:text-xl md:text-2xl font-extrabold text-swedenblue flex items-center gap-1 whitespace-nowrap"
        >
          European <span className="text-swedenyellow">Consultant</span>
        </Link>

        <ul
          id="primary-navigation"
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex gap-7 list-none items-center max-md:flex-col max-md:items-stretch max-md:text-center max-md:bg-white max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:px-5 max-md:py-6 max-md:shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-md:gap-4 max-md:max-h-[calc(100vh-4rem)] max-md:overflow-y-auto`}
        >
          {navItems.map((item) => {
            const href =
              pathname === "/" && "homeHref" in item && item.homeHref
                ? item.homeHref
                : item.href;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/services"
                  ? pathname.startsWith("/services")
                  : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-1 font-medium text-[0.95rem] hover:text-swedenblue transition-colors ${
                    isActive ? "text-swedenblue" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}

          <li className="max-md:w-full md:ml-1">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-2.5">
              {actionButtons.map((button) => (
                  <Link
                    key={button.href}
                    href={button.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={
                      button.match(pathname) ? "page" : undefined
                    }
                    className={`${actionButtonBase} ${button.className}`}
                  >
                    {button.label}
                  </Link>
                ))}
            </div>
          </li>
        </ul>

        <button
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex md:hidden shrink-0 flex-col items-center justify-center gap-[5px] -mr-2 h-11 w-11 cursor-pointer"
        >
          <span className="w-7 h-[3px] bg-ink rounded" />
          <span className="w-7 h-[3px] bg-ink rounded" />
          <span className="w-7 h-[3px] bg-ink rounded" />
        </button>
      </div>
    </header>
  );
}
