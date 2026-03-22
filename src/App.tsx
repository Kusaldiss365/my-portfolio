import { AboutSection } from "./components/about-section";
import { ContactSection } from "./components/contact-section";
import { ExperienceSection } from "./components/experience-section";
import { Footer } from "./components/footer";
import { HeroSection } from "./components/hero-seciton";
import { Navigation } from "./components/navigation";
import { ProjectsSection } from "./components/projects-section";
import { SkillsSection } from "./components/skills-section";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
