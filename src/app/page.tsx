import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Location } from "@/components/landing/Location";
import { Process } from "@/components/landing/Process";
import { PublicNav } from "@/components/landing/PublicNav";
import { ScrollAtmosphere } from "@/components/landing/ScrollAtmosphere";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Services } from "@/components/landing/Services";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-clip bg-ink">
        <ScrollAtmosphere />
        <ScrollProgress />
        <PublicNav />
        <main className="relative z-10">
          <Hero />
          <div className="relative bg-ink">
            <Services />
            <Process />
            <About />
            <Location />
            <Contact />
            <Footer />
          </div>
        </main>
        <WhatsAppFloat />
      </div>
    </SmoothScroll>
  );
}
