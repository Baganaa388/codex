"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Handshake } from "lucide-react"

const goldSponsors = [
  {
    name: "TEEE",
    description: "The Essential Engineering Education",
    logo: "/images/sponsor-teee.jpg",
  },
  {
    name: "Mobicom",
    description: "Харилцаа холбоо",
    logo: "/images/sponsor-mobicom.jpg",
  },
]

const silverSponsors = [
  {
    name: "MCS Group",
    description: "Технологи",
    logo: "/images/sponsor-mcs.jpg",
  },
  {
    name: "NUM",
    description: "Их сургууль",
    logo: "/images/sponsor-num.jpg",
  },
  {
    name: "DataCom",
    description: "Мэдээллийн технологи",
    logo: "/images/sponsor-datacom.jpg",
  },
  {
    name: "ICT Group",
    description: "Мэдээлэл технологи",
    logo: "/images/sponsor-ict.jpg",
  },
]

function SponsorCard({
  sponsor,
  tier,
  index,
  isVisible,
}: {
  sponsor: { name: string; description: string; logo: string }
  tier: "gold" | "silver"
  index: number
  isVisible: boolean
}) {
  const isGold = tier === "gold"

  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${300 + index * 120}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${
          isGold
            ? "border-amber-300/50 bg-gradient-to-br from-amber-50 via-yellow-50/80 to-white p-8 shadow-lg shadow-amber-200/20 hover:shadow-xl hover:shadow-amber-200/40 hover:border-amber-400/60"
            : "border-amber-200/30 bg-gradient-to-br from-white via-amber-50/20 to-yellow-50/30 p-6 shadow-md shadow-amber-100/10 hover:shadow-lg hover:shadow-amber-200/20 hover:border-amber-300/40"
        }`}
      >
        {/* Gold tier glow */}
        {isGold && (
          <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-amber-300/15 blur-2xl transition-all duration-500 group-hover:bg-amber-300/25 group-hover:scale-150" />
        )}

        {/* Tier badge */}
        {isGold && (
          <div className="absolute top-4 right-4">
            <div className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-md shadow-amber-300/30">
              {"Алт"}
            </div>
          </div>
        )}

        {/* Logo area */}
        <div
          className={`relative mx-auto flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ${
            isGold ? "mb-5 h-28 w-28" : "mb-4 h-20 w-20"
          }`}
        >
          <Image
            src={sponsor.logo}
            alt={`${sponsor.name} лого`}
            width={isGold ? 112 : 80}
            height={isGold ? 112 : 80}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <h3
            className={`font-bold text-gray-900 ${
              isGold ? "text-lg" : "text-base"
            }`}
          >
            {sponsor.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {sponsor.description}
          </p>
        </div>

        {/* Bottom highlight line */}
        <div
          className={`mt-4 h-0.5 w-full rounded-full transition-all duration-300 ${
            isGold
              ? "bg-gradient-to-r from-transparent via-amber-400 to-transparent group-hover:via-amber-500"
              : "bg-gradient-to-r from-transparent via-amber-300/50 to-transparent group-hover:via-amber-400/60"
          }`}
        />
      </div>
    </div>
  )
}

export function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-yellow-50/50 via-amber-50/20 to-white py-24 md:py-32"
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-[10%] h-64 w-64 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-20 right-[10%] h-80 w-80 rounded-full bg-yellow-200/15 blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div
          className={`mb-16 transition-all duration-700 md:mb-20 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div>
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-amber-200 bg-amber-50/80 px-4 py-1.5">
                <Handshake className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
                  {"Хамтрагчид"}
                </span>
              </div>
              <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                {"Ивээн "}
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  {"тэтгэгчид"}
                </span>
              </h2>
              <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-gray-500">
                {"Манай олимпиадыг дэмжиж буй байгууллагуудад баярлалаа"}
              </p>
            </div>

            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white px-5 py-2.5 text-sm font-semibold text-amber-700 shadow-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md hover:gap-3 md:mt-0"
            >
              {"Хамтрагч болох"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-12">
          <div
            className={`mb-6 flex items-center gap-3 transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-6 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-amber-400 to-transparent" />
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
              {"Алтан ивээн тэтгэгч"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-300/40 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
            {goldSponsors.map((sponsor, index) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                tier="gold"
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div>
          <div
            className={`mb-6 flex items-center gap-3 transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-6 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-gray-400 to-transparent" />
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              {"Мөнгөн ивээн тэтгэгч"}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300/40 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {silverSponsors.map((sponsor, index) => (
              <SponsorCard
                key={sponsor.name}
                sponsor={sponsor}
                tier="silver"
                index={index + goldSponsors.length}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div
          className={`mt-16 overflow-hidden rounded-2xl border border-amber-200/40 bg-gradient-to-r from-amber-50 via-yellow-50/60 to-amber-50 p-8 text-center shadow-md transition-all duration-700 md:p-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-300/15 blur-3xl" />
          <h3 className="relative text-xl font-bold text-gray-900 md:text-2xl">
            {"Хамтран ажиллахыг хүсч байна уу?"}
          </h3>
          <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            {"Бидэнтэй нэгдэж, Монголын програмчлалын ирээдүйг хамтдаа бүтээцгээе"}
          </p>
          <a
            href="#"
            className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-amber-300/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/40 hover:gap-3 hover:-translate-y-0.5"
          >
            {"Холбоо барих"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
