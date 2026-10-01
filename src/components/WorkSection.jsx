import React, { useState } from 'react';
import CaseStudyModal from './CaseStudyModal';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons';
import './WorkSection.css';

const PROJECTS = [
  {
    id: 'stash',
    title: 'STASH',
    subtitle: 'AI-assisted personal file management system',
    description: 'A file management system designed to make storing, organizing and finding personal media simpler. I designed the interface in Figma and built the system with an AI-assisted development workflow, exploring natural-language search across images, videos, audio and documents.',
    tags: ['UI/UX', 'React', 'JavaScript', 'AI'],
    liveUrl: 'https://hk-stash.vercel.app/',
    image: '/projects/stash.png',
    featured: true,
    caseStudy: {
      problem: 'Traditional file managers rely on rigid folder trees and exact filename matches, making it hard to find specific wireframe screenshots, audio memos, or design assets when filenames are generic or forgotten.',
      idea: 'Stash leverages natural-language semantic search across multimodal files (images, video clips, audio transcriptions, and PDF documents) to let users search naturally e.g. "Find wireframes from last Tuesday".',
      userFlow: 'Drag & Drop File Upload ➔ AI Indexing & Metadata Extraction ➔ Natural Language Query Input ➔ Instant Semantic Similarity Results Grid.',
      interfaceDev: 'Designed the complete UI/UX in Figma using a clean, modern off-white aesthetic. Built the web app with React, Vite, and an AI-assisted development workflow.',
      learned: 'Discovered how to effectively architect multimodal media card layouts, optimize client-side state management, and build intuitive AI search prompts.'
    }
  },
  {
    id: 'college-club',
    title: 'COLLEGE CLUB MANAGEMENT PLATFORM',
    subtitle: 'A communication and engagement platform for college communities',
    description: 'Designed the UI/UX for a college club management platform focused on communication, events, resources and student engagement. Worked with the team to translate project requirements into a clear, consistent and user-friendly interface.',
    tags: ['UI/UX', 'Product Design', 'React'],
    liveUrl: 'https://aitconnect.adra.org.in/',
    image: '/projects/adraconnects.png',
    featured: true,
    caseStudy: {
      problem: 'College communities suffer from fragmented communication across disparate messaging apps, causing low event attendance, buried announcements, and lost study resources.',
      idea: 'A unified campus engagement portal combining announcements, event RSVP calendars, realtime club chat channels, and organized resource vaults.',
      userFlow: 'Explore Campus Clubs ➔ Join Channels ➔ Register for Hackathons/Workshops ➔ Access Shared Slides & Certificates.',
      interfaceDev: 'Crafted low-fidelity wireframes, interactive user flows, and high-fidelity Figma components tailored for student leaders and active campus members.',
      learned: 'Gained hands-on experience in community product design, accessibility standards for mobile/desktop, and design system component scaling.'
    }
  },
  {
    id: 'rocket-shooter',
    title: 'ROCKET SHOOTER',
    subtitle: 'A tiny arcade game built from scratch',
    description: 'A 2D arcade-style game built using Godot, combining gameplay mechanics, interactive elements, pixel art and animation. Created the game\'s sprites and animations using Aseprite.',
    tags: ['Godot', 'Aseprite', 'Game Design'],
    liveUrl: 'https://rocket-shoot-delta.vercel.app/',
    image: '/projects/rocket-shooter.png',
    isGame: true,
    caseStudy: {
      problem: 'Exploring how retro game mechanics and pixel art animations can be built from scratch using modern open-source game engines.',
      idea: 'A fast-paced space arcade shooter featuring custom pixel player rocket sprites, laser projectiles, asteroid physics, particle explosions, and high score tracking.',
      userFlow: 'Start Game ➔ Control Rocket (Arrow Keys / WASD) ➔ Shoot Lasers (Spacebar) ➔ Dodge Enemies ➔ Set High Score.',
      interfaceDev: 'Designed all pixel-art sprites and frame-by-frame thruster animations in Aseprite. Programmed GDScript node mechanics in Godot 4.',
      learned: 'Mastered 2D collision detection, sprite sheet animation timing, state machine game loops, and exporting Godot builds for HTML5 web play.'
    }
  },
  {
    id: 'team-intro',
    title: 'TEAM INTRODUCTION POST',
    subtitle: 'Visual design / brand communication',
    description: 'Designed a team introduction post using Figma, focusing on visual consistency, hierarchy and brand alignment to effectively introduce team members.',
    tags: ['Figma', 'Visual Design', 'Branding'],
    liveUrl: null,
    image: '/projects/team-intro.png',
    caseStudy: {
      problem: 'Community leadership announcements need to capture attention on social media while maintaining strong brand consistency and visual hierarchy.',
      idea: 'A modern, high-contrast poster graphic highlighting team roles, photos, and community handles using geometric card containers.',
      userFlow: 'Grid Layout Planning ➔ Color Palette Mapping ➔ Typography Hierarchy ➔ Asset Export for Social Platforms.',
      interfaceDev: 'Created in Figma using custom vector shapes, auto-layout cards, and refined typography scales.',
      learned: 'Refined visual hierarchy, brand consistency, and social media creative optimization.'
    }
  }
];

export default function WorkSection() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  return (
    <section className="section-padding work-section" id="work">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">01 // PORTFOLIO</span>
          <h2 className="section-title">WORK</h2>
          <p className="section-subtitle">
            Things I've built, designed, and experimented with.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <div key={project.id} className="modern-card project-card">
              
              {/* Project Preview Image */}
              <div className="project-image-box">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-image-overlay">
                  {project.caseStudy && (
                    <button 
                      className="btn-secondary overlay-btn"
                      onClick={() => setSelectedCaseStudy(project)}
                    >
                      View Case Study
                    </button>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-primary overlay-btn"
                    >
                      <span>Live Project</span>
                      <ArrowUpRightIcon />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Card Meta & Info */}
              <div className="project-content">
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className={`tag-pill ${idx % 2 === 0 ? 'teal' : 'orange'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle-text">{project.subtitle}</p>
                <p className="project-desc">{project.description}</p>

                {/* Actions Footer */}
                <div className="project-actions">
                  {project.caseStudy && (
                    <button 
                      className="btn-secondary cs-trigger-btn"
                      onClick={() => setSelectedCaseStudy(project)}
                    >
                      <span>Read Case Study</span>
                      <ArrowRightIcon />
                    </button>
                  )}

                  {project.isGame ? (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary play-game-btn"
                    >
                      <span>PLAY</span>
                      <span className="play-arrow"><ArrowRightIcon /></span>
                    </a>
                  ) : (
                    project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="project-live-link"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRightIcon />
                      </a>
                    )
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      <CaseStudyModal 
        project={selectedCaseStudy} 
        onClose={() => setSelectedCaseStudy(null)} 
      />
    </section>
  );
}
