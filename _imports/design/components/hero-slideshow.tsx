"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    src: "/images/slide-1.jpg",
    alt: "Programming competition scene",
  },
  {
    src: "/images/slide-2.jpg",
    alt: "Hands typing code",
  },
  {
    src: "/images/slide-3.jpg",
    alt: "Coding olympiad auditorium",
  },
  {
    src: "/images/slide-4.jpg",
    alt: "Abstract code visualization",
  },
]

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 1200)
    },
    [isTransitioning]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentSlide, goToSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: index === currentSlide ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            {"Програмчлалын Олимпиад 2026"}
          </span>
        </div>

        <h1 className="max-w-5xl text-balance text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          {"Код бол "}
          <span className="text-primary">
            {"ирээдүй"}
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/50 md:text-xl">
          {"CodeX олимпиадад оролцож, өөрийн чадвараа сорь. Монголын шилдэг програмистуудтай өрсөлдөж, дараагийн түвшинд хүр."}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/register"
            className="group flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            {"Бүртгүүлэх"}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/leaders"
            className="flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground/40 hover:bg-foreground/5"
          >
            {"Лидерүүд үзэх"}
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground md:text-4xl">{"500+"}</div>
            <div className="mt-1 text-xs tracking-wider text-foreground/50 uppercase">
              {"Оролцогч"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground md:text-4xl">{"50+"}</div>
            <div className="mt-1 text-xs tracking-wider text-foreground/50 uppercase">
              {"Бодлого"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground md:text-4xl">{"12"}</div>
            <div className="mt-1 text-xs tracking-wider text-foreground/50 uppercase">
              {"Аймаг"}
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-4 bg-foreground/30 hover:bg-foreground/50"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest text-foreground/40 uppercase [writing-mode:vertical-lr]">
            {"Scroll"}
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
