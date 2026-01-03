import FloatingAvatars from "@/components/FloatingAvatars";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GamesSection from "@/components/GamesSection";
import VisionSection from "@/components/VisionSection";
import HonorableMentions from "@/components/HonorableMentions";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <FloatingAvatars />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <GamesSection />
        <VisionSection />
        <HonorableMentions />
        <CommunitySection />
      </main>
      <Footer />
      <ThemeToggle />
    </div>
  );
};

export default Index;
