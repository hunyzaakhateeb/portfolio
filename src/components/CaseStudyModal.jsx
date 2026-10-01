import React from 'react';
import {
  ArrowUpRightIcon,
  BulbIcon,
  RocketIcon,
  MapIcon,
  PaletteIcon,
  SparkIcon,
  XIcon
} from './Icons';
import './CaseStudyModal.css';

export default function CaseStudyModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content case-study-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Case Study">
          <XIcon />
        </button>

        <div className="cs-header">
          <div className="cs-tags">
            {project.tags.map((t, idx) => (
              <span key={idx} className="tag-pill teal">{t}</span>
            ))}
          </div>
          <h2 className="cs-title">{project.title}</h2>
          <p className="cs-subtitle">{project.subtitle}</p>
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-primary cs-live-btn"
            >
              <span>Launch Live App</span>
              <ArrowUpRightIcon />
            </a>
          )}
        </div>

        {/* Featured Visual Hero Image */}
        <div className="cs-hero-image-box">
          <img src={project.image} alt={project.title} className="cs-hero-img" />
        </div>

        {/* Detailed Case Study Sections */}
        <div className="cs-body-grid">
          {project.caseStudy?.problem && (
            <div className="cs-block">
              <h3 className="cs-block-title"><BulbIcon /> The Problem</h3>
              <p className="cs-block-text">{project.caseStudy.problem}</p>
            </div>
          )}

          {project.caseStudy?.idea && (
            <div className="cs-block">
              <h3 className="cs-block-title"><RocketIcon /> The Solution &amp; Core Idea</h3>
              <p className="cs-block-text">{project.caseStudy.idea}</p>
            </div>
          )}

          {project.caseStudy?.userFlow && (
            <div className="cs-block full-width">
              <h3 className="cs-block-title"><MapIcon /> User Flow &amp; Architecture</h3>
              <p className="cs-block-text">{project.caseStudy.userFlow}</p>
            </div>
          )}

          {project.caseStudy?.interfaceDev && (
            <div className="cs-block full-width">
              <h3 className="cs-block-title"><PaletteIcon /> Figma Design &amp; AI Workflow</h3>
              <p className="cs-block-text">{project.caseStudy.interfaceDev}</p>
            </div>
          )}

          {project.caseStudy?.learned && (
            <div className="cs-block full-width highlight-block">
              <h3 className="cs-block-title"><SparkIcon /> What I Learned &amp; Takeaways</h3>
              <p className="cs-block-text">{project.caseStudy.learned}</p>
            </div>
          )}
        </div>

        <div className="cs-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Case Study
          </button>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <span>Visit Live Project</span>
              <ArrowUpRightIcon />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
