import React from 'react';
import gdgLogo from '../../logos/gdg.png';
import codeClubLogo from '../../logos/codeclub.png';
import oscodeLogo from '../../logos/oscode.png';
import './CommunitySection.css';

const COMMUNITIES = [
  {
    name: 'Google Developer Groups',
    shortName: 'GDG',
    role: 'Designer',
    description: 'Designed marketing assets including posters, social media graphics and certificates for GDG events while working with the team to maintain visual consistency.',
    tags: ['Brand Identity', 'Event Posters', 'Social Media', 'Certificates'],
    logo: gdgLogo,
    colorClass: 'gdg-card'
  },
  {
    name: 'Code Club',
    shortName: 'Code Club',
    role: 'Designer',
    description: 'Exploring the intersection of coding and creativity through event design, visual communication and interactive projects.',
    tags: ['Swag & Stickers', 'Event Graphics', 'Interactive Dev'],
    logo: codeClubLogo,
    colorClass: 'codeclub-card'
  },
  {
    name: 'OSCode Community',
    shortName: 'OSCode',
    role: 'Content & Innovation Lead',
    description: 'Worked on content strategy, creative initiatives, events and tutorials aimed at making the community more engaging and useful for learners.',
    tags: ['Content Strategy', 'Open Source', 'Tutorials', 'Community Growth'],
    logo: oscodeLogo,
    colorClass: 'oscode-card'
  }
];

export default function CommunitySection() {
  return (
    <section className="section-padding community-section" id="community">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">04 // COLLABORATION</span>
          <h2 className="section-title">PEOPLE, PROJECTS &amp; COMMUNITIES</h2>
          <p className="section-subtitle">
            Some of my favourite work has happened while building things with other people.
          </p>
        </div>

        {/* Community Cards Grid */}
        <div className="community-grid">
          {COMMUNITIES.map((c, idx) => {
            return (
              <article
                key={idx}
                className={`modern-card community-card ${c.colorClass}`}
                tabIndex={0}
                aria-labelledby={`community-name-${idx}`}
              >
                
                <div className="comm-card-header">
                  <div className="comm-icon-badge">
                    <img className="comm-logo" src={c.logo} alt={`${c.shortName} logo`} />
                  </div>
                  <div>
                    <h3 className="comm-name" id={`community-name-${idx}`}>{c.name}</h3>
                    <span className="comm-role-tag">{c.role}</span>
                  </div>
                </div>

                <p className="comm-desc">{c.description}</p>

                <div className="comm-tags">
                  {c.tags.map((t, tIdx) => (
                    <span key={tIdx} className="tag-pill teal">{t}</span>
                  ))}
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
