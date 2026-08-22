import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | European Consultant",
  description:
    "Ready to start your global journey? Get in touch with European Consultant today.",
};

export default function ContactPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-16 md:py-[70px] text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Get In <span className="text-swedenyellow">Touch</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Ready to start your global journey? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 grid md:grid-cols-2 gap-10 md:gap-12">
          <div className="min-w-0">
            <h3 className="text-2xl text-swedenblue mb-5 font-bold">📍 Reach Us</h3>
            <div className="flex items-start gap-3 mb-3.5">
              <span className="text-xl w-9 shrink-0 text-center">📍</span>
              <span className="min-w-0 break-words">
                Jakthornsgatan 98A, 65631 Karlstad, Sweden
              </span>
            </div>
            <div className="flex items-start gap-3 mb-3.5">
              <span className="text-xl w-9 shrink-0 text-center">📞</span>
              <a
                href="tel:+46735534659"
                className="min-w-0 break-words hover:text-swedenblue"
              >
                +46 735 534 659
              </a>
            </div>
            <div className="flex items-start gap-3 mb-3.5">
              <span className="text-xl w-9 shrink-0 text-center">📧</span>
              <a
                href="mailto:manartanveer@gmail.com"
                className="min-w-0 break-all hover:text-swedenblue"
              >
                manartanveer@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-3 mb-3.5">
              <span className="text-xl w-9 shrink-0 text-center">💬</span>
              <span className="min-w-0 break-words">WhatsApp: +46735534659</span>
            </div>

            <div className="mt-8 bg-lightbg px-5 sm:px-6 py-5 rounded-xl border-l-[5px] border-swedenyellow">
              <p className="font-semibold text-swedenblue">📋 Quick Response</p>
              <p className="text-sm text-muted">
                We typically respond within 24 hours. For urgent queries, call
                or WhatsApp us.
              </p>
            </div>

            <div className="mt-6">
              <p className="font-semibold text-swedenblue">🏢 Office Hours:</p>
              <p className="text-muted">
                Monday – Friday: 9:00 AM – 6:00 PM (CET)
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
