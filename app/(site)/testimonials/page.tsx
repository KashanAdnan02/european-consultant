import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials | European Consultant",
  description:
    "Real stories from people who trusted European Consultant with their global relocation journey.",
  alternates: { canonical: "/testimonials" },
};

const testimonials = [
  {
    quote:
      "Their visa help was amazing! I got full support through the whole process and everything was smooth. Highly recommended!",
    name: "Ahmed K.",
    service: "Germany Work Permit",
  },
  {
    quote:
      "Fast responses, great guidance, highly recommended for anyone applying for a visa! They made the whole process stress-free.",
    name: "Maria S.",
    service: "UK Visit Visa",
  },
  {
    quote:
      "They helped me with all documentation and my visa was approved on the first attempt! Professional and trustworthy team.",
    name: "James O.",
    service: "Canada Tourist Visa",
  },
  {
    quote:
      "Very professional team — super helpful and always there when I had questions. I would use them again without hesitation.",
    name: "Priya R.",
    service: "Lithuania Work Permit",
  },
  {
    quote:
      "European Consultant made my relocation to Sweden seamless. From visa to housing, they handled everything with care.",
    name: "Carlos M.",
    service: "Sweden Relocation",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-16 md:py-[70px] text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Client <span className="text-swedenyellow">Testimonials</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Real stories from people who trusted us with their global journey.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
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
        </div>
      </section>
    </div>
  );
}
