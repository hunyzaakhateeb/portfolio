import React from 'react';
import {
  AcademicCapIcon,
  TrophyIcon,
  CogIcon,
  SparkIcon,
  BoltIcon
} from './Icons';
import './EducationAndExtra.css';

// Initial projects for "CURRENTLY BUILDING..." array (easily expandable by user!)
const BUILDING_PROJECTS = [
  {
    id: 1,
    title: 'AI FLOOR PLAN GENERATOR',
    subtitle: 'Turning 2D floor plans into interactive 3D spaces.',
    status: 'IN PROGRESS',
    description: 'An AI-powered floor plan generation tool that transforms 2D layouts into 3D visualizations. The project explores intelligent room arrangement, interactive floor plan editing, and machine learning to make spatial design more accessible and intuitive.',
    exploring: [
      { label: 'Interactive 2D Editor', detail: 'Create, drag, resize, and arrange rooms and other layout elements.' },
      { label: '2D to 3D Conversion', detail: 'Transform floor plan layouts into 3D spatial visualizations.' },
      { label: 'AI/ML Integration', detail: 'Experiment with training models to understand and generate floor plan layouts using structured datasets.' }
    ],
    futureScope: 'Explore immersive AR/VR experiences for visualizing designed spaces.',
    techStack: ['React', 'Konva.js', 'Python', 'PyTorch']
  }
];

export default function EducationAndExtra() {
  return (
    <div className="edu-extra-container">
      
      {/* 13. EDUCATION (Compact) */}
      <section className="section-padding edu-section" id="education">
        <div className="container">
          <div className="section-header compact-header">
            <span className="section-label">07 // ACADEMICS</span>
            <h2 className="section-title">EDUCATION</h2>
          </div>

          <div className="modern-card edu-card">
            <div className="edu-card-content">
              <div className="edu-logo-badge"><AcademicCapIcon /></div>
              <div className="edu-info">
                <span className="edu-dates">2024 — 2028</span>
                <h3 className="edu-institution">ATRIA INSTITUTE OF TECHNOLOGY</h3>
                <p className="edu-degree">B.E. Computer Science Engineering</p>
              </div>
              <div className="edu-cgpa-badge">
                <span className="cgpa-label">CGPA</span>
                <span className="cgpa-val">8.73</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. OTHER THINGS I'VE TRIED */}
      <section className="section-padding extra-section">
        <div className="container">
          <div className="section-header compact-header">
            <span className="section-label">08 // EXPERIENCES</span>
            <h2 className="section-title">OTHER THINGS I'VE TRIED</h2>
          </div>

          <div className="extra-grid">
            
            <div className="modern-card extra-card">
              <div className="extra-icon-badge"><TrophyIcon /></div>
              <h3 className="extra-card-title">SMART INDIA HACKATHON</h3>
              <p className="extra-card-desc">
                Worked with a team on a hardware-based problem statement and qualified among the Top 10 teams from the college.
              </p>
            </div>

            <div className="modern-card extra-card">
              <div className="extra-icon-badge"><CogIcon /></div>
              <h3 className="extra-card-title">ENGINEERING WORKSHOP</h3>
              <p className="extra-card-desc">
                Led a team in designing and building a functional trebuchet for a hands-on engineering competition.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 15. CURRENTLY BUILDING... (Flexible, extensible section) */}
      <section className="section-padding building-section">
        <div className="container">
          <div className="section-header compact-header">
            <span className="section-label">09 // IN THE LAB</span>
            <h2 className="section-title">CURRENTLY BUILDING...</h2>
            <p className="section-subtitle">
              Always experimenting with something new.
            </p>
          </div>

          <div className="building-grid">
            {BUILDING_PROJECTS.map((proj) => (
              <div key={proj.id} className="modern-card building-card">
                <div className="building-status-row">
                  <span className="status-badge pulse-subtle"><BoltIcon /> {proj.status}</span>
                  <span className="tag-pill teal"><SparkIcon /></span>
                </div>
                <h3 className="building-title">{proj.title}</h3>
                <p className="building-subtitle">{proj.subtitle}</p>
                <p className="building-desc">{proj.description}</p>
                <h4 className="building-subheading">Currently exploring</h4>
                <ul className="building-feature-list">
                  {proj.exploring.map((feature) => (
                    <li key={feature.label}>
                      <strong>{feature.label}:</strong> {feature.detail}
                    </li>
                  ))}
                </ul>
                <p className="building-future"><strong>Future scope:</strong> {proj.futureScope}</p>
                <h4 className="building-subheading">Tech stack</h4>
                <div className="building-tags">
                  {proj.techStack.map((t) => (
                    <span key={t} className="tag-pill orange">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
