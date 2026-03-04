import { Header } from "@/components/header"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { RegistrationTimeline } from "@/components/registration-timeline"
import { Sponsors } from "@/components/sponsors"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSlideshow />
      <RegistrationTimeline />
      <Sponsors />
    </main>
  )
}
