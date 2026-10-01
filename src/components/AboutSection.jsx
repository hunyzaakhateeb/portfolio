import React from 'react';
import {
  PaletteIcon,
  SparkIcon,
  CodeIcon,
  RobotIcon,
  GamepadIcon,
  RocketIcon
} from './Icons';
import './AboutSection.css';

const INTERESTS = [
  { label: 'UI/UX DESIGN', icon: PaletteIcon, color: 'teal' },
  { label: 'VISUAL DESIGN', icon: SparkIcon, color: 'orange' },
  { label: 'CREATIVE DEVELOPMENT', icon: CodeIcon, color: 'blue' },
  { label: 'AI / ML', icon: RobotIcon, color: 'purple' },
  { label: 'GAME DESIGN', icon: GamepadIcon, color: 'gold' },
  { label: 'INTERACTIVE EXPERIENCES', icon: RocketIcon, color: 'teal' }
];

export default function AboutSection() {
  return (
    <section className="section-padding about-section" id="about">
      <div className="container">
        
        <div className="about-card-wrapper">
          <div className="modern-card about-card">
            
            {/* Header */}
            <div className="section-header about-header">
              <span className="section-label" style={{ color: '#FF6B86' }}>02 // PROFILE</span>
              <h2 className="section-title" style={{ color: '#FF6B86' }}>A Little About Me</h2>
            </div>

            {/* Bio Paragraphs */}
            <div className="about-bio-text">
              <p>
                I'm a Computer Science student who likes turning ideas into things people can actually interact with.
              </p>
              <p>
                I work across <strong>UI/UX, visual design and development</strong>, while exploring AI, creative coding and interactive experiences.
              </p>
              <p>
                I enjoy taking something that feels complicated or ordinary and figuring out how to make it clearer, more intuitive and a little more interesting.
              </p>
            </div>

            {/* Currently Into Grid */}
            <div className="currently-into-block">
              <h3 className="currently-title">CURRENTLY INTO</h3>
              <div className="interests-grid">
                {INTERESTS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={`interest-pill ${item.color}`}>
                      <span className="interest-icon"><Icon /></span>
                      <span className="interest-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
