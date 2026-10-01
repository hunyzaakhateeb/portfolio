import React, { useState, useEffect } from 'react';
import FluidBackground from './components/FluidBackground';
import Hero from './components/Hero';
import CharacterCameo from './components/CharacterCameo';
import BackupMenu from './components/BackupMenu';
import WorkSection from './components/WorkSection';
import AboutSection from './components/AboutSection';
import CommunitySection from './components/CommunitySection';
import ToolboxSection from './components/ToolboxSection';
import EducationAndExtra from './components/EducationAndExtra';
import ContactSection from './components/ContactSection';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOutsideHero, setIsOutsideHero] = useState(false);
  const [heroExitProgress, setHeroExitProgress] = useState(0);

  // Activate decorative cameos only after the hero has mostly left the viewport.
  useEffect(() => {
    let animationFrame = null;

    const handleScroll = () => {
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        const heroEl = document.getElementById('hero');
        if (!heroEl) return;
        const heroBottom = heroEl.getBoundingClientRect().bottom;
        const exitRange = Math.max(1, window.innerHeight * 0.65);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const progress = reducedMotion
          ? Number(window.scrollY > 0)
          : Math.min(Math.max(window.scrollY / exitRange, 0), 1);

        setHeroExitProgress(progress);
        setIsOutsideHero(heroBottom <= window.innerHeight * 0.25);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <FluidBackground />
      <div className="portfolio-app">
        {/* Secondary Backup Navigation Drawer */}
        <BackupMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <CharacterCameo enabled={isOutsideHero} />

        {/* 1. Hero Landing Viewport */}
        <Hero
          onOpenMenu={() => setIsMenuOpen(true)}
          characterExitProgress={heroExitProgress}
        />

        {/* Main Content Flow */}
        <main className="main-content-flow">
          {/* 2. Selected Work */}
          <WorkSection />

          {/* 3. A Little About Me */}
          <AboutSection />

          {/* 4. Communities & Collaborations */}
          <CommunitySection />

          {/* 5. My Toolbox / Skills */}
          <ToolboxSection />

          {/* 6. Education, Other Experiences & Currently Building */}
          <EducationAndExtra />

          {/* 7. Contact & Footer */}
          <ContactSection />
        </main>
      </div>
    </>
  );
}
