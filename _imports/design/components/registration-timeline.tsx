"use client"

import { useEffect, useRef, useState } from "react"
import { ClipboardList, Brain, Trophy, Award } from "lucide-react"

const steps = [
  {
    title: "Бүртгэл",
    description: "Онлайнаар бүртгүүлэх",
    date: "03/01 - 04/10",
    icon: ClipboardList,
  },
  {
    title: "Шалгаруулалт",
    description: "Эхний шатны бодолт",
    date: "04/12",
    icon: Brain,
  },
  {
    title: "Финал",
    description: "Улаанбаатар хотод",
    date: "04/15",
    icon: Trophy,
  },
  {
    title: "Шагнал",
    description: "Ялагчдыг тодруулах",
    date: "04/15",
    icon: Award,
  },
]

function TimelineCard({
  step,
  index,
  isVisible,
}: {
  step: (typeof steps)[0]
  index: number
  isVisible: boolean
}) {
  const Icon = step.icon

  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/50 to-yellow-50/80 p-6 shadow-lg shadow-amber-100/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/30 hover:-translate-y-1 md:p-8">
        {/* Subtle glow behind icon */}
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl transition-all duration-500 group-hover:bg-amber-300/30 group-hover:scale-125" />

        {/* Step number */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-300/30">
            <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-700">
            {step.date}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {step.description}
        </p>

        {/* Step indicator */}
        <div className="mt-5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-xs font-bold text-white">
            {index + 1}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-300/60 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export function RegistrationTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-yellow-50/50 py-24 md:py-32"
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-yellow-200/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-100/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div
          className={`mb-16 text-center transition-all duration-700 md:mb-20 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
              {"Хуваарь"}
            </span>
          </div>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            {"Тэмцээний "}
            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {"үе шатууд"}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-gray-500">
            {"Бүртгэлээс шагнал хүртэл бүх алхмуудыг дагаж мөрдөнө үү"}
          </p>
        </div>

        {/* Desktop timeline - horizontal */}
        <div className="hidden lg:block">
          {/* Connection line */}
          <div className="relative mb-10">
            <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 -translate-y-1/2">
              <div
                className={`h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 transition-all duration-1000 ease-out ${
                  isVisible ? "w-full" : "w-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              />
            </div>
            {/* Dots on the line */}
            <div className="relative flex justify-between px-[8%]">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-400 bg-white transition-all duration-500 ${
                    isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                  style={{ transitionDelay: `${400 + index * 200}ms` }}
                >
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <TimelineCard
                key={step.title}
                step={step}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet timeline - vertical */}
        <div className="lg:hidden">
          <div className="relative flex flex-col gap-6">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300 md:left-8" />

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className={`relative flex gap-5 pl-14 transition-all duration-700 ease-out md:pl-20 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Dot on line */}
                  <div className="absolute left-[18px] top-8 flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-400 bg-white md:left-[26px]">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/50 to-yellow-50/80 p-5 shadow-lg shadow-amber-100/40">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-300/30">
                        <Icon
                          className="h-4 w-4 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-700">
                        {step.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
