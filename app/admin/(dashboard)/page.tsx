import Link from "next/link";
import { ArrowUpRight, EyeOff, Layers, Tag } from "lucide-react";
import { Badge, Card, PageHeading } from "@/components/admin/ui";
import { getAppointmentPrice, getServices } from "@/lib/queries";
import { formatDate, formatPrice } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: typeof Layers;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition hover:border-swedenblue/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-swedenblue/10 text-swedenblue">
          <Icon size={20} />
        </span>
        <ArrowUpRight
          size={18}
          className="text-slate-300 transition group-hover:text-swedenblue"
        />
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [services, price] = await Promise.all([
    getServices(),
    getAppointmentPrice(),
  ]);

  const publishedCount = services.filter((item) => item.is_published).length;
  const recentServices = [...services]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  return (
    <>
      <PageHeading
        title="Dashboard"
        description="An overview of your published services and consultation pricing."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Published services"
          value={String(publishedCount)}
          icon={Layers}
          href="/admin/services"
        />
        <StatCard
          label="Hidden from website"
          value={String(services.length - publishedCount)}
          icon={EyeOff}
          href="/admin/services"
        />
        <StatCard
          label="Appointment fee"
          value={price ? formatPrice(price.amount, price.currency) : "—"}
          icon={Tag}
          href="/admin/pricing"
        />
      </div>

      <div className="mt-8">
        <Card
          title="Recently updated"
          description="The latest changes made to your service pages."
          actions={
            <Link
              href="/admin/services/new"
              className="inline-flex h-10 items-center rounded-lg bg-swedenblue px-4 text-sm font-semibold text-white transition hover:bg-swedenblueDark"
            >
              Add service
            </Link>
          }
        >
          {recentServices.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No services yet. Add your first one to get started.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentServices.map((service) => (
                <li
                  key={service.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-sm font-semibold text-ink hover:text-swedenblue"
                    >
                      {service.country}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Updated {formatDate(service.updated_at)}
                    </p>
                  </div>
                  <Badge tone={service.is_published ? "success" : "neutral"}>
                    {service.is_published ? "Published" : "Hidden"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
