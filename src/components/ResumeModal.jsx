import React from 'react';
import { FileIcon, XIcon } from './Icons';
import './ResumeModal.css';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content resume-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Resume">
          <XIcon />
        </button>

        <div className="resume-header">
          <div>
            <h2 className="resume-name">HUNYZAA KHATEEB</h2>
            <p className="resume-title">B.E. Computer Science Engineering • UI/UX &amp; Creative Developer</p>
            <p className="resume-contact-line">hunyzaak@gmail.com • Bengaluru, India • Atria Institute of Technology</p>
          </div>
          <div className="resume-header-actions">
            <button 
              className="btn-primary" 
              onClick={() => {
                alert('Downloading Hunyzaa Khateeb Resume PDF...');
              }}
            >
              <FileIcon />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <div className="resume-body">
          
          <div className="resume-section">
            <h3 className="resume-section-title">EDUCATION</h3>
            <div className="resume-item">
              <div className="resume-item-row">
                <span className="item-bold">Atria Institute of Technology</span>
                <span className="item-date">2024 — 2028</span>
              </div>
              <p className="item-sub">Bachelor of Engineering in Computer Science Engineering | CGPA: 8.73</p>
            </div>
          </div>

          <div className="resume-section">
            <h3 className="resume-section-title">FEATURED PROJECTS</h3>
            <div className="resume-item">
              <div className="resume-item-row">
                <span className="item-bold">STASH — AI Personal File Management System</span>
                <span className="item-link">hk-stash.vercel.app</span>
              </div>
              <p className="item-desc">
                Designed UI/UX in Figma and built multimodal natural-language search across media, documents, and video with AI workflows.
              </p>
            </div>
            <div className="resume-item">
              <div className="resume-item-row">
                <span className="item-bold">Rocket Shooter — 2D Godot Arcade Game</span>
                <span className="item-link">rocket-shoot-delta.vercel.app</span>
              </div>
              <p className="item-desc">
                Built a 2D arcade game in Godot 4 engine with custom pixel-art sprites and thruster animations created in Aseprite.
              </p>
            </div>
          </div>

          <div className="resume-section">
            <h3 className="resume-section-title">COMMUNITY LEADERSHIP</h3>
            <div className="resume-item">
              <span className="item-bold">Google Developer Groups (GDG) — Designer</span>
              <p className="item-desc">Created event posters, social media banners, and certificates for campus tech fests.</p>
            </div>
            <div className="resume-item">
              <span className="item-bold">Code Club &amp; OSCode — Designer / Content &amp; Innovation Lead</span>
              <p className="item-desc">Led creative design initiatives, laptop swag sticker packs, and community learning workshops.</p>
            </div>
          </div>

          <div className="resume-section">
            <h3 className="resume-section-title">TECHNICAL SKILLS</h3>
            <p className="item-desc">
              <strong>Design:</strong> Figma, Canva, Photopea, Aseprite, UI/UX Wireframing, Prototyping, Visual Communication<br />
              <strong>Development:</strong> HTML, CSS, JavaScript, React, Python, Godot 4, Git/GitHub
            </p>
          </div>

        </div>

        <div className="resume-footer">
          <button className="btn-secondary" onClick={onClose}>Close Preview</button>
        </div>

      </div>
    </div>
  );
}
