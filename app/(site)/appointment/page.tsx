"use client";

import Image from "next/image";
import { ChevronUp, MessageSquare } from "lucide-react";
import Link from "next/link";

interface VisaOffice {
  title: string;
  description: string;
  image: string;
}

const visaOffices: VisaOffice[] = [
  {
    title: "Portugal Visa Appointment Office",
    description:
      "We provide professional visa appointment assistance for the following offices.",
    image: "/images/portugal.webp",
  },
  {
    title: "Pakistan Visa Appointment Office",
    description:
      "We help clients book visa appointments with accurate information and professional support.",
    image: "/images/pakistan.svg",
  },
  {
    title: "Germany Visa Appointment Office",
    description:
      "We provide professional visa appointment assistance with accurate information and reliable support.",
    image: "/images/germany.webp",
  },
  {
    title: "Sweden Appointment Office",
    description:
      "Get professional assistance for your visa appointment booking and application process.",
    image: "/images/sweden.webp",
  },
];

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-white">
      {/* ================= HEADER ================= */}
      <section className="relative bg-[#e4003b] px-4 py-10 text-white sm:py-12">
        {/* Language Button */}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-[38px] items-center gap-2 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm sm:right-[18px] sm:top-[10px]"
        >
          <span className="text-[22px] leading-none">🇬🇧</span>

          <span>EN</span>

          <ChevronUp size={15} strokeWidth={2} />
        </button>

        {/* Header Content */}
        <div className="mt-10 flex flex-col items-center justify-center sm:mt-0">
          <h1 className="text-center text-2xl font-bold leading-tight sm:text-[30px] sm:leading-[36px]">
            Visa Appointment Services
          </h1>

          <p className="mt-3 max-w-[540px] text-center text-[15px] leading-[22px] sm:text-[16px]">
            We provide professional visa appointment assistance for the
            following offices.
          </p>
        </div>
      </section>

      {/* ================= VISA CARDS ================= */}
      <section className="px-4 py-8 sm:px-5">
        <div className="mx-auto grid w-full max-w-[735px] grid-cols-1 gap-6 sm:grid-cols-2">
          {visaOffices.map((office: VisaOffice, index: number) => (
            <VisaCard
              key={office.title}
              office={office}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      {/* ================= CHAT BUTTON ================= */}
      <button
        type="button"
        aria-label="Open chat"
        className="fixed bottom-5 right-5 z-50 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#4dd994] text-white shadow-lg transition-transform duration-200 hover:scale-105 sm:right-6"
      >
        <MessageSquare size={23} fill="white" strokeWidth={1.5} />
      </button>
    </main>
  );
}

/* ================= VISA CARD ================= */

interface VisaCardProps {
  office: VisaOffice;
  priority?: boolean;
}

function VisaCard({ office, priority = false }: VisaCardProps): JSX.Element {
  return (
    <div className="flex flex-col overflow-hidden rounded-[11px] border border-gray-200 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.25)] sm:p-[20px]">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:h-[234px]">
        <Image
          src={office.image}
          alt={office.title}
          fill
          priority={priority}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 350px"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col pt-[16px]">
        <h2 className="text-[18px] font-bold leading-[24px] text-[#101010] sm:max-w-[290px] sm:text-[20px] sm:leading-[26px]">
          {office.title}
        </h2>

        <p className="mt-4 text-[15px] leading-[26px] text-[#626773] sm:mt-[20px] sm:min-h-[47px] sm:leading-[28px]">
          {office.description}
        </p>

        <Link
          href={"/book-appointment"}
          className="mt-[17px] inline-block self-start rounded-[3px] bg-[#ff4d4d] px-[19px] py-[11px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#ed3e3e]"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
