"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Globe,
  LayoutDashboard,
  Menu,
  Layers,
  Tag,
  X,
} from "lucide-react";
import SignOutButton from "@/components/admin/SignOutButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Services", icon: Layers, exact: false },
  {
    href: "/admin/appointment-services",
    label: "Appointment Services",
    icon: CalendarDays,
    exact: false,
  },
  { href: "/admin/pricing", label: "Appointment Price", icon: Tag, exact: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-white/15 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  email,
  onNavigate,
}: {
  email: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-swedenblueDark px-4 py-6">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="px-3 text-lg font-extrabold tracking-tight text-white"
      >
        European <span className="text-swedenyellow">Consultant</span>
      </Link>
      <p className="mt-1 px-3 text-xs font-medium uppercase tracking-widest text-slate-400">
        Admin Panel
      </p>

      <div className="mt-8 flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Globe size={18} />
          View website
        </Link>
        <SignOutButton />
        <p
          title={email}
          className="truncate px-3 pt-2 text-xs text-slate-400"
        >
          {email}
        </p>
      </div>
    </div>
  );
}

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent email={email} />
      </aside>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <SidebarContent
              email={email}
              onNavigate={() => setIsMenuOpen(false)}
            />
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-white"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMenuOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-ink">Admin Panel</span>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
