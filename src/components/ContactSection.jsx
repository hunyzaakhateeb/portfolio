import React, { useState } from 'react';
import ResumeModal from './ResumeModal';
import mailLogo from '../../logos/mail.png';
import linkedinLogo from '../../logos/linkedin.png';
import githubLogo from '../../logos/github.png';
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  FileIcon,
  PixelIcon
} from './Icons';
import './ContactSection.css';

export default function ContactSection() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const subject = encodeURIComponent('Hello from your portfolio');
    const body = encodeURIComponent(trimmedMessage);
    window.location.href = `mailto:hunyzaak@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="section-padding contact-section" id="contact">
      <div className="container">
        
        <div className="contact-card-box">
          <div className="modern-card contact-card">
            
            {/* Header */}
            <div className="section-header contact-header">
              <span className="section-label" style={{ color: '#FF6B86' }}>10 // SAY HELLO</span>
              <h2 className="section-title contact-heading" style={{ color: '#FF6B86' }}>LET'S CONNECT!</h2>
              <p className="section-subtitle contact-sub" style={{color: '#FF6B86' }}>Whether it's design, tech, or just a good conversation.</p>
            </div>

            <form className="message-compose-form" onSubmit={handleMessageSubmit}>
              <label className="message-compose-label" htmlFor="contact-message">
                Write me a message
              </label>
              <textarea
                id="contact-message"
                className="message-compose-input"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What would you like to talk about?"
                rows="4"
                maxLength={4000}
                required
              />
              <div className="message-compose-footer">
                <span className="message-compose-note">Your email app will open with your message ready.</span>
                <div className="message-send-wrap">
                  <button className="btn-primary message-send-btn" type="submit">
                    <span>Send email</span>
                    <ArrowUpRightIcon />
                  </button>
                </div>
              </div>
            </form>

            {/* Links & Resume Row */}
            <div className="contact-links-grid">

              <a
                href="mailto:hunyzaak@gmail.com"
                className="contact-link-pill"
              >
                <span className="link-icon"><img src={mailLogo} alt="" /></span>
                <span className="link-text">Email</span>
                <span className="link-arrow"><ArrowUpRightIcon /></span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/hunyzaa-khateeb/" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-link-pill"
              >
                <span className="link-icon social-logo-icon"><img src={linkedinLogo} alt="" /></span>
                <span className="link-text">LinkedIn</span>
                <span className="link-arrow"><ArrowUpRightIcon /></span>
              </a>

              <a 
                href="https://github.com/hunyzaakhateeb" 
                target="_blank" 
                rel="noreferrer" 
                className="contact-link-pill"
              >
                <span className="link-icon social-logo-icon"><img src={githubLogo} alt="" /></span>
                <span className="link-text">GitHub</span>
                <span className="link-arrow"><ArrowUpRightIcon /></span>
              </a>

              <button 
                className="contact-link-pill resume-pill"
                onClick={() => setIsResumeOpen(true)}
              >
                <span className="link-icon"><FileIcon /></span>
                <span className="link-text">View Resume</span>
                <span className="link-arrow"><ArrowRightIcon /></span>
              </button>

            </div>

            {/* Signature Footer */}
            <div className="contact-signature-row">
              <div className="signature-left">
                <span className="sig-name">Hunyzaa Khateeb ♡</span>
              </div>
              <p className="sig-note">
                GAME OVER? NOT YET.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
}
