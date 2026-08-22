"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Search } from "lucide-react";
import DeleteAppointmentServiceButton from "@/components/admin/DeleteAppointmentServiceButton";
import { Badge, TextInput } from "@/components/admin/ui";
import type { AppointmentServiceRow } from "@/lib/supabase/database.types";
import { formatDate } from "@/lib/utils";

export default function AppointmentServicesTable({
  services,
}: {
  services: AppointmentServiceRow[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return services;
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
    );
  }, [query, services]);

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h2 className="text-base font-semibold text-ink">
          No appointment services yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Add your first visa appointment office with a name, flag image and
          short description.
        </p>
        <Link
          href="/admin/appointment-services/new"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-swedenblue px-5 text-sm font-semibold text-white transition hover:bg-swedenblueDark"
        >
          Add your first office
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <TextInput
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or description"
          aria-label="Search appointment services"
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Office
              </th>
              <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell md:px-6">
                Order
              </th>
              <th className="hidden px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell lg:px-6">
                Updated
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Status
              </th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((service) => (
              <tr key={service.id} className="transition hover:bg-slate-50/60">
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      <Image
                        src={service.flag_image}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/appointment-services/${service.id}`}
                        className="text-sm font-semibold text-ink hover:text-swedenblue"
                      >
                        {service.name}
                      </Link>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 text-sm text-slate-600 md:table-cell md:px-6">
                  {service.sort_order}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-slate-500 lg:table-cell lg:px-6">
                  {formatDate(service.updated_at)}
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <Badge tone={service.is_published ? "success" : "neutral"}>
                    {service.is_published ? "Published" : "Hidden"}
                  </Badge>
                </td>
                <td className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href="/appointment"
                      target="_blank"
                      aria-label={`Preview ${service.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <Link
                      href={`/admin/appointment-services/${service.id}`}
                      aria-label={`Edit ${service.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-swedenblue/40 hover:bg-swedenblue/5 hover:text-swedenblue"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteAppointmentServiceButton
                      id={service.id}
                      name={service.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            No appointment services match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
