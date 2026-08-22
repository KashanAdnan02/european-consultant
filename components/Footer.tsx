import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-[#c0c8d0] pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 mb-9">
          <div className="min-w-0">
            <h4 className="text-white text-lg mb-4 font-semibold">
              European Consultant
            </h4>
            <p className="leading-loose">
              Nordic Trust, Global Reach. Your trusted partner for visa, HR, and
              relocation services worldwide. Based in Karlstad, Sweden.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg mb-4 font-semibold">Quick Links</h4>
            <Link href="/" className="block leading-loose hover:text-swedenyellow">
              Home
            </Link>
            <Link href="/about" className="block leading-loose hover:text-swedenyellow">
              About
            </Link>
            <Link href="/services" className="block leading-loose hover:text-swedenyellow">
              Services
            </Link>
            <Link
              href="/testimonials"
              className="block leading-loose hover:text-swedenyellow"
            >
              Testimonials
            </Link>
            <Link href="/contact" className="block leading-loose hover:text-swedenyellow">
              Contact
            </Link>
          </div>
          <div>
            <h4 className="text-white text-lg mb-4 font-semibold">Services</h4>
            <Link href="/services" className="block leading-loose hover:text-swedenyellow">
              Work Permits
            </Link>
            <Link href="/services" className="block leading-loose hover:text-swedenyellow">
              Tourist Visas
            </Link>
            <Link href="/services" className="block leading-loose hover:text-swedenyellow">
              Business Invitations
            </Link>
            <Link href="/services" className="block leading-loose hover:text-swedenyellow">
              Company Formations
            </Link>
          </div>
          <div className="min-w-0">
            <h4 className="text-white text-lg mb-4 font-semibold">Contact</h4>
            <p className="leading-loose">📞 +46 735 534 659</p>
            <p className="leading-loose break-all">📧 manartanveer@gmail.com</p>
            <p className="leading-loose">
              📍 Jakthornsgatan 98A
              <br />
              65631 Karlstad, Sweden
            </p>
          </div>
        </div>
        <div className="border-t border-[#2a3a4a] pt-5 text-center text-sm text-[#7a8a9a]">
          &copy; {new Date().getFullYear()} European Consultant. All rights
          reserved. Built with 💙 in Sweden.
        </div>
      </div>
    </footer>
  );
}
