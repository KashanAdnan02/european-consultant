import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | European Consultant",
  description:
    "Founded in 2025 in Karlstad, Sweden — learn about European Consultant's mission, story, and values.",
};

const values = [
  { icon: "🤝", title: "Trust", text: "We earn it with every client." },
  { icon: "⚡", title: "Speed", text: "We work fast without cutting corners." },
  { icon: "🌍", title: "Global Reach", text: "40+ countries, one partner." },
  { icon: "💙", title: "Human Touch", text: "You're not just a case number." },
];

export default function AboutPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-16 md:py-[70px] text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            About <span className="text-swedenyellow">European Consultant</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Your trusted partner for global mobility — based in Sweden.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl text-swedenblue mb-5 font-bold">Our Story</h2>
            <p className="text-muted mb-4">
              <strong className="text-ink">European Consultant</strong> was founded
              in <strong className="text-ink">2025</strong> in Karlstad, Sweden,
              with a simple mission: to make international relocation seamless,
              transparent, and human.
            </p>
            <p className="text-muted mb-4">
              We understand that moving to a new country is one of life&apos;s
              biggest decisions. That&apos;s why we combine deep HR expertise
              with on-the-ground support in 40+ countries — from work permits
              and visa applications to housing and integration.
            </p>
            <p className="text-muted mb-4">
              Our team is built on{" "}
              <strong className="text-ink">integrity, speed, and professionalism</strong>.
              We treat every client like family, guiding them through every
              step of their global journey.
            </p>
            <p className="text-muted font-semibold">
              🇸🇪 Based in Sweden. Serving the world.
            </p>
          </div>
          <div className="bg-lightbg p-6 sm:p-8 rounded-2xl border border-border">
            <h3 className="text-swedenblue mb-4 text-xl font-bold">Our Values</h3>
            <ul className="list-none p-0">
              {values.map((value, index) => (
                <li
                  key={value.title}
                  className={`py-2.5 ${
                    index !== values.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  {value.icon} <strong>{value.title}</strong> – {value.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
