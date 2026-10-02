import React, { useState, useEffect, useRef } from 'react';
import CharacterCanvas from './CharacterCanvas';
import {
  MenuIcon,
  ArrowRightIcon,
} from './Icons';
import './Hero.css';

const DIALOGUE_MESSAGES = [
  "Welcome to my little corner of the internet.",
  "Yeah, this tiny pixel person. That’s me, Hunyzaa!",
  "Computer Science student with a soft spot for design and creativity.",
  "Making the internet a little less boring."
];

export default function Hero({ onOpenMenu, characterExitProgress = 0 }) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [hoveredNavLink, setHoveredNavLink] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [introVisible, setIntroVisible] = useState(true);
  const introTextRef = useRef(null);
  const heroTitleRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroVisible(false);
      return undefined;
    }

    let flightAnimation;
    let flightTimer;
    let removeTimer;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;

      flightTimer = window.setTimeout(() => {
        const introText = introTextRef.current;
        const heroTitle = heroTitleRef.current;
        if (!introText || !heroTitle) {
          setIntroVisible(false);
          return;
        }

        const start = introText.getBoundingClientRect();
        const end = heroTitle.getBoundingClientRect();
        const translateX = end.left + end.width / 2 - (start.left + start.width / 2);
        const translateY = end.top + end.height / 2 - (start.top + start.height / 2);
        const scaleX = end.width / start.width;
        const scaleY = end.height / start.height;

        flightAnimation = introText.animate(
          [
            { transform: 'translate(0, 0) scale(1, 1)' },
            { transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})` }
          ],
          { duration: 750, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'forwards' }
        );

        flightAnimation.onfinish = () => {
          setIntroVisible(false);
          removeTimer = window.setTimeout(() => flightAnimation?.cancel(), 100);
        };
      }, 2450);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(flightTimer);
      window.clearTimeout(removeTimer);
      flightAnimation?.cancel();
    };
  }, []);

  // Typing effect
  useEffect(() => {
    const fullText = DIALOGUE_MESSAGES[dialogueIndex];
    let charIndex = 0;
    setTypedText('');

    const timer = setInterval(() => {
      if (charIndex <= fullText.length) {
        setTypedText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [dialogueIndex]);

  const handleCharacterClick = () => {
    setDialogueIndex((prev) => (prev + 1) % DIALOGUE_MESSAGES.length);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-viewport" id="hero">

      {introVisible && (
        <div className="hero-intro-overlay" aria-label="Hunyzaa Khateeb introduction">
          <svg className="hero-intro-svg" viewBox="0 0 1000 150" aria-hidden="true">
            <text ref={introTextRef} className="hero-intro-name" x="500" y="96" textAnchor="middle">
              HUNYZAA KHATEEB
            </text>
          </svg>
          <div className="hero-intro-curtain" />
        </div>
      )}

      {/* Secondary Backup Navigation Menu Trigger */}
      <button
        className="backup-menu-btn"
        onClick={onOpenMenu}
        aria-label="Open Menu"
      >
        <span className="menu-btn-dot"></span>
        <span className="menu-btn-text">MENU</span>
        <span className="menu-btn-icon"><MenuIcon /></span>
      </button>

      {/* Main Hero Centralized Stage */}
      <div className="hero-center-stage">

        {/* Name Header above character */}
        <div className={`hero-name-header${introVisible ? ' is-intro-hidden' : ''}`}>
          <span className="hero-badge-tag">UI/UX &amp; CREATIVE DEVELOPER</span>
          <h1 className="hero-title-name" ref={heroTitleRef}>HUNYZAA KHATEEB</h1>
        </div>

        {/* Character & Organic Scattered Navigation Composition */}
        <div className="hero-character-composition">

          {/* Scattered Organic Navigation Items */}
          <button
            className="scattered-nav nav-work"
            onMouseEnter={() => setHoveredNavLink('work')}
            onMouseLeave={() => setHoveredNavLink(null)}
            onClick={() => scrollToSection('work')}
          >
            <span className="nav-index">01</span>
            <span className="nav-label">WORK</span>
            <span className="nav-arrow"><ArrowRightIcon /></span>
          </button>

          <button
            className="scattered-nav nav-about"
            onMouseEnter={() => setHoveredNavLink('about')}
            onMouseLeave={() => setHoveredNavLink(null)}
            onClick={() => scrollToSection('about')}
          >
            <span className="nav-index">02</span>
            <span className="nav-label">ABOUT</span>
            <span className="nav-arrow"><ArrowRightIcon /></span>
          </button>

          <button
            className="scattered-nav nav-community"
            onMouseEnter={() => setHoveredNavLink('community')}
            onMouseLeave={() => setHoveredNavLink(null)}
            onClick={() => scrollToSection('community')}
          >
            <span className="nav-index">03</span>
            <span className="nav-label">COMMUNITY</span>
            <span className="nav-arrow"><ArrowRightIcon /></span>
          </button>

          <button
            className="scattered-nav nav-contact"
            onMouseEnter={() => setHoveredNavLink('contact')}
            onMouseLeave={() => setHoveredNavLink(null)}
            onClick={() => scrollToSection('contact')}
          >
            <span className="nav-index">04</span>
            <span className="nav-label">CONTACT</span>
            <span className="nav-arrow"><ArrowRightIcon /></span>
          </button>

          {/* Centralized Living Pixel Character */}
          <div
            className="hero-character-anchor"
            style={{
              opacity: 1 - characterExitProgress,
              transform: `translate3d(0, ${characterExitProgress * -64}px, 0) scale(${1 - characterExitProgress * 0.12})`,
              pointerEvents: characterExitProgress >= 1 ? 'none' : 'auto'
            }}
            inert={characterExitProgress >= 1 ? '' : undefined}
          >
            <CharacterCanvas
              onCharacterClick={handleCharacterClick}
              hoveredNavLink={hoveredNavLink}
            />
          </div>

        </div>

        {/* Modernized Classic Game Dialogue Box */}
        <div className="hero-dialogue-wrapper">
          <div className="dialogue-box" onClick={handleCharacterClick} title="Click to cycle dialogue">
            <p className="dialogue-text">
              {typedText}
              <span className="dialogue-cursor">|</span>
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
