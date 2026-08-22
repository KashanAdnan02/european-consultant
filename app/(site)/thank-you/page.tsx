import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | European Consultant",
  description: "Your message has been received. We'll be in touch within 24 hours.",
};

export default function ThankYouPage() {
  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-24 md:py-[120px] text-center min-h-[70vh] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <div className="text-4xl sm:text-5xl bg-swedenyellow text-ink w-20 h-20 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-full flex items-center justify-center mx-auto mb-8 animate-popIn">
            ✅
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Thank You! <span className="text-swedenyellow">We&apos;ll Be in Touch</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 opacity-90">
            Your message has been received. Our team will review your inquiry
            and get back to you within 24 hours.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="inline-block px-9 py-3.5 rounded-full font-semibold bg-swedenyellow text-ink hover:bg-swedenyellowDark transition-all"
            >
              Return to Home
            </Link>
            <Link
              href="/services"
              className="inline-block px-9 py-3.5 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-swedenblue transition-all"
            >
              Browse Services
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/15">
            <p className="text-sm opacity-70">
              📞 Need immediate assistance? Call us at{" "}
              <strong className="text-swedenyellow">+46 735 534 659</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
