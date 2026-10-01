import React from 'react';

function IconBase({ children, className = '', size = 22, strokeWidth = 1.75, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon-inline ${className}`.trim()}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function PaletteIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17h.5a2.5 2.5 0 0 0 2.5-2.5v-.5a1.5 1.5 0 0 1 1.5-1.5h.5a2.5 2.5 0 0 0 2.5-2.5A8.5 8.5 0 0 0 12 3.5Z" />
      <circle cx="8" cy="9.5" r="1.1" />
      <circle cx="10.5" cy="7" r="1.1" />
      <circle cx="14" cy="9.5" r="1.1" />
    </IconBase>
  );
}

export function SparkIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 2.5 1.8 5.7L19.5 10l-5.7 1.8L12 17.5l-1.8-5.7L4.5 10l5.7-1.8L12 2.5Z" />
    </IconBase>
  );
}

export function CodeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m14 4-4 16" />
    </IconBase>
  );
}

export function BoltIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M13 2 5.5 12H10l-1 10 8.5-10H14l1-10Z" />
    </IconBase>
  );
}

export function RobotIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3v3" />
      <rect x="4.5" y="6" width="15" height="14" rx="3" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M9 16h6" />
    </IconBase>
  );
}

export function GamepadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7.5 9h9a4.5 4.5 0 0 1 4.3 3.2l1 3.5a2.5 2.5 0 0 1-3.9 2.7l-2.5-1.8H8.6l-2.5 1.8a2.5 2.5 0 0 1-3.9-2.7l1-3.5A4.5 4.5 0 0 1 7.5 9Z" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="16" cy="12" r=".75" />
      <circle cx="18" cy="14" r=".75" />
    </IconBase>
  );
}

export function RocketIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M14 3.5c2.6 1 4.5 3 5.5 5.5-2.8 1-4.7 3.1-5.5 5.8-2.7-.8-4.8-2.7-5.8-5.3.9-2.8 3-4.9 5.8-5.9Z" />
      <path d="M13 11.5 9 15.5" />
      <path d="M7.5 16.5 5 19" />
      <circle cx="12" cy="12" r="1.5" />
    </IconBase>
  );
}

export function AcademicCapIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3.5 9.5 12 5l8.5 4.5L12 14 3.5 9.5Z" />
      <path d="M7 11.2v4.2c0 1.5 2.2 3.1 5 3.1s5-1.6 5-3.1V11.2" />
      <path d="M20.5 9.5V15" />
    </IconBase>
  );
}

export function TrophyIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 4h10v3.5A5.5 5.5 0 0 1 12 13a5.5 5.5 0 0 1-5-5.5V4Z" />
      <path d="M7 4H4.5A1.5 1.5 0 0 0 3 5.5V6a3 3 0 0 0 3 3M17 4h2.5A1.5 1.5 0 0 1 21 5.5V6a3 3 0 0 1-3 3" />
      <path d="M9.5 19h5M10.5 16h3" />
    </IconBase>
  );
}

export function CogIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.2M12 19v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.8 12h2.2M19 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </IconBase>
  );
}

export function MailIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

export function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </IconBase>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  );
}

export function MenuIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function FileIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 3.5h6l4 4V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <path d="M13 3.5v4h4" />
    </IconBase>
  );
}

export function LinkedinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 9v8M7 6.5h.01M11 17v-4.5a2.5 2.5 0 0 1 5 0V17M11 9v8" />
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
    </IconBase>
  );
}

export function GithubIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 19c-4 1.2-4-2-5-2M15 22v-3.2A3.2 3.2 0 0 0 12 16c-3.1 0-4.8 1.8-4.8 4.2V22" />
      <path d="M12 2.5A9.5 9.5 0 0 0 2.5 12c0 4.2 2.7 7.8 6.5 9.1.5.1.7-.2.7-.5v-2.2c-2.7.6-3.3-1.3-3.3-1.3-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.5 1.1 3.1.9.1-.7.3-1.1.6-1.4-2.1-.2-4.4-1.1-4.4-4.8 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1a9.8 9.8 0 0 1 5.3 0c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.7 1.1 2.8 0 3.7-2.3 4.6-4.5 4.8.4.3.7.9.7 1.9v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 21.5 12 9.5 9.5 0 0 0 12 2.5Z" />
    </IconBase>
  );
}

export function PixelIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 6h4v4H6zM14 6h4v4h-4zM6 14h4v4H6zM14 14h4v4h-4z" />
      <path d="M10 10h4v4h-4z" />
    </IconBase>
  );
}

export function BulbIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 18h6M10 21h4M9 15a3 3 0 1 1 6 0c0 1.3-.8 2.2-1.6 2.8H10.6A2.9 2.9 0 0 1 9 15Z" />
      <path d="M12 3.5A6.5 6.5 0 0 0 6 10c0 2.5 1.4 3.7 2.6 4.9.7.7 1.4 1.5 1.4 2.6" />
    </IconBase>
  );
}

export function MapIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </IconBase>
  );
}

export function UsersIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M3.5 18c.7-2.5 2.9-4 5.5-4s4.8 1.5 5.5 4" />
      <path d="M15.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M18.5 18c-.4-1.8-1.8-3.1-4-3.5" />
    </IconBase>
  );
}

export function XIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}
