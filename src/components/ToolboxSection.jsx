import React from 'react';
import {
  PaletteIcon,
  BoltIcon,
  SparkIcon,
  UsersIcon
} from './Icons';
import './ToolboxSection.css';

const TOOLBOX_DATA = [
  {
    category: 'DESIGN',
    icon: PaletteIcon,
    color: 'teal',
    items: ['Figma', 'Canva', 'Aseprite', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Visual Communication']
  },
  {
    category: 'DEVELOPMENT',
    icon: BoltIcon,
    color: 'blue',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Godot', 'C']
  },
  {
    category: 'CREATIVE',
    icon: SparkIcon,
    color: 'orange',
    items: ['Visual Design', 'Content Strategy', 'Social Media Design', 'Pixel Art', 'Brand Consistency', 'Game Design', 'Sprite Animation']
  },
  {
    category: 'SOFT SKILLS',
    icon: UsersIcon,
    color: 'purple',
    items: ['Collaboration', 'Problem Solving', 'Time Management', 'Adaptability', 'Team Leadership']
  }
];

export default function ToolboxSection() {
  return (
    <section className="section-padding toolbox-section" id="toolbox">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">06 // STACK</span>
          <h2 className="section-title">MY TOOLBOX</h2>
          <p className="section-subtitle">
            A modern toolkit of design software, code languages, creative workflows, and collaborative skills.
          </p>
        </div>

        {/* Toolkit Grid */}
        <div className="toolbox-grid">
          {TOOLBOX_DATA.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div key={idx} className={`modern-card toolbox-card ${group.color}`}>
                
                <div className="toolbox-card-header">
                  <span className="toolbox-icon"><Icon /></span>
                  <h3 className="toolbox-category-title">{group.category}</h3>
                </div>

                <div className="toolbox-items-list">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="tool-item-pill">
                      <span className="tool-dot"></span>
                      <span className="tool-name">{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
