import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/queries";
import { groupServicesByType } from "@/lib/service-types";

export const metadata: Metadata = {
  title: "European Consultant – Visa & Relocation Services",
  description:
    "Your trusted visa, HR and relocation partner based in Sweden, covering work permits, tourist visas and company formation in 40+ countries.",
  alternates: { canonical: "/" },
};

export const revalidate = 60;

const whyChooseUs = [
  {
    icon: "⚡",
    title: "Fast & Transparent",
    text: "Clear timelines and honest communication at every step.",
  },
  {
    icon: "📄",
    title: "Professional Documentation",
    text: "Expertly prepared applications with zero errors.",
  },
  {
    icon: "🌍",
    title: "Multi-Country Assistance",
    text: "Navigate visas and permits for 40+ countries with ease.",
  },
  {
    icon: "💙",
    title: "Dedicated Customer Care",
    text: "Personalized support from start to finish.",
  },
];

const testimonials = [
  {
    quote:
      "Their visa help was amazing! Full support through the whole process and everything was smooth.",
    name: "Ahmed K.",
    service: "Germany Work Permit",
  },
  {
    quote:
      "Fast responses, great guidance, highly recommended for anyone applying for a visa!",
    name: "Maria S.",
    service: "UK Visit Visa",
  },
  {
    quote:
      "They helped me with all documentation and my visa was approved on the first attempt!",
    name: "James O.",
    service: "Canada Tourist Visa",
  },
];

const stats = [
  { value: "500+", label: "Clients Served" },
  { value: "40+", label: "Countries Covered" },
  { value: "95%", label: "Success Rate" },
  { value: "4.9★", label: "Client Rating" },
];

export default async function HomePage() {
  const services = await getPublishedServices();
  const groupedServices = groupServicesByType(services);

  return (
    <div className="animate-fadeIn">
      {/* HERO */}
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-24 md:py-[100px] text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Nordic Trust,{" "}
            <span className="text-swedenyellow">Global Reach</span>
          </h1>
          <p className="text-base md:text-xl max-w-2xl mx-auto mb-9 opacity-90">
            Your trusted visa, HR &amp; relocation partner — based in Sweden,
            serving the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#services"
              className="inline-block px-9 py-3.5 rounded-full font-semibold bg-swedenyellow text-ink hover:bg-swedenyellowDark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)] transition-all"
            >
              Explore Services
            </Link>
            <Link
              href="/contact"
              className="inline-block px-9 py-3.5 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-swedenblue transition-all"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-16 md:py-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl text-swedenblue mb-5 font-bold">
              About European Consultant
            </h2>
            <p className="text-muted mb-4">
              <strong className="text-ink">Founded in 2025</strong> in Karlstad,
              Sweden, European Consultant is a premier international HR, visa,
              and relocation services agency.
            </p>
            <p className="text-muted mb-4">
              We specialize in connecting ambitious professionals, skilled
              workers, and international students with life-changing
              opportunities across 40+ countries. Our expertise spans the full
              relocation journey — from work permits and visa assistance to
              housing coordination and seamless integration.
            </p>
            <p className="text-muted mb-4">
              <strong className="text-ink">Our commitment:</strong> ethical,
              transparent, and efficient service that makes every transition
              smoother, faster, and more human.
            </p>
            <Link
              href="/about"
              className="inline-block mt-4 px-9 py-3.5 rounded-full font-semibold bg-swedenblue text-white hover:bg-swedenblueDarker hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,91,153,0.35)] transition-all"
            >
              Read More
            </Link>
          </div>
          <div>
            <div className="bg-swedenblue text-white px-6 py-8 sm:px-8 sm:py-10 rounded-2xl text-center">
              <div className="text-5xl sm:text-6xl mb-2">🇸🇪</div>
              <h3 className="text-xl sm:text-2xl mb-2 font-bold">
                Based in Sweden
              </h3>
              <p className="opacity-85">Jakthornsgatan 98A, 65631 Karlstad</p>
              <p className="opacity-85 mt-1.5">Serving clients worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      {/* SERVICES */}
      <section className="py-16 md:py-[70px] scroll-mt-20" id="services">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h2 className="text-3xl md:text-[2.2rem] font-bold text-center mb-4">
            Our Services
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-11 text-lg">
            Work permits, tourist visas, business invitations, and company
            formations worldwide.
          </p>
          {services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center text-muted">
              Published services will appear here once added in the admin panel.
            </div>
          ) : (
            groupedServices.map((section) => (
              <div key={section.type} className="mb-10 last:mb-0">
                <h3 className="mb-4 inline-block border-b-4 border-swedenyellow pb-2 text-xl font-bold text-swedenblue sm:text-2xl">
                  {section.emoji} {section.heading}
                </h3>
                {section.services.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                    {section.services.map((service) => (
                      <Link
                        href={`/services/${service.slug}`}
                        key={service.id}
                        className="rounded-xl border-l-4 border-swedenyellow bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                      >
                        <h4 className="mb-1 text-base font-semibold text-swedenblue">
                          {service.flag} {service.title}
                        </h4>
                        <p className="text-sm text-muted">{service.text}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    No services in this category yet.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <section className="pb-16 md:pb-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 text-center">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              >
                <h3 className="text-3xl sm:text-4xl text-swedenblue font-bold">
                  {stat.value}
                </h3>
                <p className="text-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-[70px] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h2 className="text-3xl md:text-[2.2rem] font-bold text-center mb-4">
            Why Choose Us
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-11 text-lg">
            We make your global move simple, transparent, and stress-free.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="text-lg text-swedenblue mb-1.5 font-semibold">
                  {item.title}
                </h4>
                <p className="text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS PREVIEW */}
      <section className="py-16 md:py-[70px] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h2 className="text-3xl md:text-[2.2rem] font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-center text-muted max-w-2xl mx-auto mb-11 text-lg">
            Real stories from people who achieved their visa dreams with us.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-6 sm:p-7 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-t-4 border-swedenyellow"
              >
                <div className="text-swedenyellow text-xl mb-2.5">★★★★★</div>
                <p className="italic mb-3">&quot;{t.quote}&quot;</p>
                <div className="font-semibold text-swedenblue">{t.name}</div>
                <div className="text-sm text-muted">{t.service}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/testimonials"
              className="inline-block px-9 py-3.5 rounded-full font-semibold border-2 border-swedenblue text-swedenblue hover:bg-swedenblue hover:text-white transition-all"
            >
              Read More Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
