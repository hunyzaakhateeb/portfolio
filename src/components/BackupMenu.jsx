import React from 'react';
import { ArrowRightIcon, BoltIcon, XIcon } from './Icons';
import './BackupMenu.css';

export default function BackupMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Selected Work', id: 'work', num: '01' },
    { label: 'A Little About Me', id: 'about', num: '02' },
    { label: 'Community & Projects', id: 'community', num: '03' },
    { label: 'My Toolbox', id: 'toolbox', num: '04' },
    { label: 'Contact', id: 'contact', num: '05' },
  ];

  const handleNavClick = (id) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="backup-menu-overlay" onClick={onClose}>
      <div className="backup-menu-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="backup-menu-header">
          <div className="menu-header-brand">
            <span className="brand-dot"></span>
            <span className="brand-name" style={{ color: '#000' }}>HUNYZAA KHATEEB</span>
          </div>
          <button className="menu-close-btn" onClick={onClose} aria-label="Close Menu">
            <XIcon />
          </button>
        </div>

        <nav className="backup-menu-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="menu-nav-item"
              onClick={() => handleNavClick(item.id)}
            >
              <span className="item-num">{item.num}</span>
              <span className="item-label">{item.label}</span>
              <span className="item-arrow"><ArrowRightIcon /></span>
            </button>
          ))}
        </nav>

        <div className="backup-menu-footer">
          <p className="footer-status"> See yaaa!!!</p>
          <div className="footer-socials">
            <a href="mailto:hunyzaak@gmail.com" target="_blank" rel="noreferrer">Email</a>
            <span>•</span>
            <a href="https://github.com/hunyzaakhateeb" target="_blank" rel="noreferrer">GitHub</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/hunyzaa-khateeb/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

      </div>
    </div>
  );
}
