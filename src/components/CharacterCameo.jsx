import React, { useEffect, useRef, useState } from 'react';
import './CharacterCameo.css';

const CAMEO_SPRITE = '/assets/hk.png';
const FRAME_SIZE = { width: 400, height: 300 };

// Adjust these values to tune the cameo cadence and how long she peeks in.
const CAMEO_MIN_DELAY = 9000;
const CAMEO_MAX_DELAY = 22000;
const CAMEO_MIN_VISIBLE = 2200;
const CAMEO_MAX_VISIBLE = 4300;
const CAMEO_SIDE_PEEK = 0.6;
const CAMEO_MIN_PEEK = 0.32;
const CAMEO_MAX_PEEK = 0.72;
const CAMEO_EDGES = ['left', 'right', 'bottom'];
const CONTENT_SELECTOR = 'h1, h2, h3, h4, p, button, a, input, textarea, select, [role="button"], .modern-card, .modal-content';

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

function getPeekRect(edge, peek, width, height, viewportWidth, viewportHeight) {
  const visibleWidth = width * peek;
  const visibleHeight = height * peek;

  if (edge === 'left') {
    const topMin = viewportHeight * 0.2;
    const topMax = Math.max(topMin, viewportHeight * 0.8 - height);
    const top = randomBetween(topMin, topMax);
    return { left: 0, right: visibleWidth, top, bottom: top + height };
  }

  if (edge === 'right') {
    const topMin = viewportHeight * 0.2;
    const topMax = Math.max(topMin, viewportHeight * 0.8 - height);
    const top = randomBetween(topMin, topMax);
    return { left: viewportWidth - visibleWidth, right: viewportWidth, top, bottom: top + height };
  }

  const leftMin = Math.min(viewportWidth * 0.15, Math.max(0, viewportWidth - width));
  const leftMax = Math.max(leftMin, viewportWidth * 0.85 - width);
  const left = randomBetween(leftMin, leftMax);
  return { left, right: left + width, top: viewportHeight - visibleHeight, bottom: viewportHeight };
}

function overlapsContent(rect) {
  const elements = document.querySelectorAll(CONTENT_SELECTOR);
  return [...elements].some((element) => {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const bounds = element.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return false;
    return rect.left < bounds.right
      && rect.right > bounds.left
      && rect.top < bounds.bottom
      && rect.bottom > bounds.top;
  });
}

function choosePlacement() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isSmallScreen = viewportWidth <= 600;
  const width = Math.min(isSmallScreen ? 152 : 250, viewportWidth * (isSmallScreen ? 0.4 : 0.23));
  const height = width * FRAME_SIZE.height / FRAME_SIZE.width;
  const edges = isSmallScreen ? ['left', 'right', 'bottom'] : CAMEO_EDGES;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const edge = randomItem(edges);
    const peek = edge === 'bottom'
      ? randomBetween(CAMEO_MIN_PEEK, CAMEO_MAX_PEEK)
      : CAMEO_SIDE_PEEK;
    const rect = getPeekRect(edge, peek, width, height, viewportWidth, viewportHeight);
    if (overlapsContent(rect)) continue;

    if (edge === 'left') {
      return { edge, peek, width, top: rect.top, left: 0 };
    }
    if (edge === 'right') {
      return { edge, peek, width, top: rect.top, right: 0 };
    }
    return { edge, peek, width, left: rect.left, bottom: 0 };
  }

  return null;
}

export default function CharacterCameo({ enabled }) {
  const [cameo, setCameo] = useState(null);
  const [spriteReady, setSpriteReady] = useState(false);
  const spriteRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const sprite = new Image();
    sprite.onload = () => setSpriteReady(true);
    sprite.src = CAMEO_SPRITE;
    spriteRef.current = sprite;

    return () => {
      sprite.onload = null;
    };
  }, []);

  useEffect(() => {
    if (!spriteReady || !spriteRef.current) return undefined;
    const canvas = document.querySelector('.character-cameo__sprite');
    if (!canvas) return undefined;
    canvas.width = FRAME_SIZE.width;
    canvas.height = FRAME_SIZE.height;
    const context = canvas.getContext('2d');
    if (!context) return undefined;
    context.imageSmoothingEnabled = false;
    context.drawImage(spriteRef.current, 0, 0, FRAME_SIZE.width, FRAME_SIZE.height, 0, 0, FRAME_SIZE.width, FRAME_SIZE.height);
    return undefined;
  }, [spriteReady, cameo]);

  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCameo(null);
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      return undefined;
    }

    let disposed = false;
    const setTimer = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((activeTimer) => activeTimer !== timer);
        if (!disposed) callback();
      }, delay);
      timersRef.current.push(timer);
    };

    const scheduleNext = () => {
      const isSmallScreen = window.innerWidth <= 600;
      const minimumDelay = isSmallScreen ? CAMEO_MIN_DELAY * 1.8 : CAMEO_MIN_DELAY;
      const maximumDelay = isSmallScreen ? CAMEO_MAX_DELAY * 1.5 : CAMEO_MAX_DELAY;

      setTimer(() => {
        if (document.hidden) {
          scheduleNext();
          return;
        }

        const placement = choosePlacement();
        if (!placement) {
          setTimer(scheduleNext, randomBetween(3500, 6500));
          return;
        }

        const enterDuration = randomBetween(650, 950);
        const exitDuration = randomBetween(550, 850);
        setCameo({ ...placement, phase: 'hidden', enterDuration, exitDuration });

        setTimer(() => {
          setCameo((current) => current && { ...current, phase: 'entering' });
          setTimer(() => {
            setCameo((current) => current && { ...current, phase: 'visible' });
            setTimer(() => {
              setCameo((current) => current && { ...current, phase: 'exiting' });
              setTimer(() => {
                setCameo(null);
                scheduleNext();
              }, exitDuration);
            }, randomBetween(CAMEO_MIN_VISIBLE, CAMEO_MAX_VISIBLE));
          }, enterDuration);
        }, 40);
      }, randomBetween(minimumDelay, maximumDelay));
    };

    scheduleNext();

    return () => {
      disposed = true;
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      setCameo(null);
    };
  }, [enabled, spriteReady]);

  if (!cameo || !spriteReady) return null;

  const position = {
    width: `${cameo.width}px`,
    '--peek-visible': `${cameo.peek * 100}%`,
    '--enter-duration': `${cameo.enterDuration}ms`,
    '--exit-duration': `${cameo.exitDuration}ms`,
    ...(cameo.top !== undefined ? { top: `${cameo.top}px` } : {}),
    ...(cameo.left !== undefined ? { left: `${cameo.left}px` } : {}),
    ...(cameo.right !== undefined ? { right: `${cameo.right}px` } : {}),
    ...(cameo.bottom !== undefined ? { bottom: `${cameo.bottom}px` } : {})
  };

  return (
    <div
      className={`character-cameo character-cameo--${cameo.edge} character-cameo--${cameo.phase}`}
      style={position}
      aria-hidden="true"
    >
      <canvas className="character-cameo__sprite" />
    </div>
  );
}
