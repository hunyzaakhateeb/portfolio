import React, { useEffect, useRef } from 'react';

const CHARACTER_IMAGE = '/assets/hk.png';
const PIXEL_CHARACTER_IMAGE = '/assets/pixel-hk-sheet.png';
const CANVAS_SIZE = 480;
const SPRITE_FRAME_SIZE = { width: 400, height: 300 };
const SPRITE_INDEX_MAP = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7
};
const SPRITE_LAYOUT = {
  right: [4, 3, 2, 1],
  left: [5, 6, 7, 8]
};

function getSpriteFrame(gaze) {
  const side = gaze?.side ?? (gaze?.x <= 0 ? 'left' : 'right');
  const sequence = SPRITE_LAYOUT[side] ?? SPRITE_LAYOUT.right;
  const distance = Math.min(1, Math.abs(gaze?.x ?? 0));
  const index = Math.min(sequence.length - 1, Math.floor(distance * (sequence.length - 1) + 0.5));
  const keyedFrame = sequence[index];
  return SPRITE_INDEX_MAP[keyedFrame] ?? keyedFrame;
}

function drawCharacter(canvas, spriteSheets, gaze) {
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const spriteSheet = gaze?.verticalSide === 'bottom' ? spriteSheets.bottom : spriteSheets.top;
  if (!context || !spriteSheet) return;

  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  context.imageSmoothingEnabled = false;

  const spriteFrame = getSpriteFrame(gaze);
  const sourceX = (spriteFrame % 2) * SPRITE_FRAME_SIZE.width;
  const sourceY = Math.floor(spriteFrame / 2) * SPRITE_FRAME_SIZE.height;
  const baseScale = Math.min(CANVAS_SIZE / SPRITE_FRAME_SIZE.width, CANVAS_SIZE / SPRITE_FRAME_SIZE.height);
  const renderScale = baseScale * 1.12;
  const renderWidth = SPRITE_FRAME_SIZE.width * renderScale;
  const renderHeight = SPRITE_FRAME_SIZE.height * renderScale;
  const drawX = (CANVAS_SIZE - renderWidth) / 2;
  const drawY = (CANVAS_SIZE - renderHeight) / 2;

  context.drawImage(
    spriteSheet,
    sourceX,
    sourceY,
    SPRITE_FRAME_SIZE.width,
    SPRITE_FRAME_SIZE.height,
    drawX,
    drawY,
    renderWidth,
    renderHeight
  );

}

export default function CharacterCanvas({ onCharacterClick, hoveredNavLink }) {
  const canvasRef = useRef(null);
  const spriteSheetsRef = useRef({ top: null, bottom: null });
  const gazeRef = useRef({ x: 0, y: 0, side: 'left', verticalSide: 'top' });

  useEffect(() => {
    const loadSpriteSheet = (key, source) => {
      const image = new Image();
      image.onload = () => {
        spriteSheetsRef.current[key] = image;
        if (!canvasRef.current) return;
        canvasRef.current.width = CANVAS_SIZE;
        canvasRef.current.height = CANVAS_SIZE;
        drawCharacter(canvasRef.current, spriteSheetsRef.current, gazeRef.current);
      };
      image.src = source;
      return image;
    };

    const topImage = loadSpriteSheet('top', CHARACTER_IMAGE);
    const bottomImage = loadSpriteSheet('bottom', PIXEL_CHARACTER_IMAGE);

    return () => {
      topImage.onload = null;
      bottomImage.onload = null;
    };
  }, []);

  const updateGazeFromPointer = (event) => {
    const nextGaze = {
      x: Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1)),
      side: event.clientX < window.innerWidth / 2 ? 'left' : 'right',
      verticalSide: event.clientY < window.innerHeight / 2 ? 'top' : 'bottom'
    };
    gazeRef.current = nextGaze;
    if (canvasRef.current) {
      drawCharacter(canvasRef.current, spriteSheetsRef.current, nextGaze);
    }
  };

  const resetGaze = () => {
    const centeredGaze = { x: 0, y: 0, side: 'left', verticalSide: 'top' };
    gazeRef.current = centeredGaze;
    if (canvasRef.current) {
      drawCharacter(canvasRef.current, spriteSheetsRef.current, centeredGaze);
    }
  };

  useEffect(() => {
    window.addEventListener('pointermove', updateGazeFromPointer);
    window.addEventListener('pointerleave', resetGaze);

    return () => {
      window.removeEventListener('pointermove', updateGazeFromPointer);
      window.removeEventListener('pointerleave', resetGaze);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCharacterClick?.();
    }
  };

  return (
    <div className={`character-canvas-wrapper${hoveredNavLink ? ` is-hovering-${hoveredNavLink}` : ''}`}>
      <canvas
        ref={canvasRef}
        className="character-canvas"
        role="button"
        tabIndex={0}
        aria-label="Pixel character. Activate to change its dialogue."
        onClick={onCharacterClick}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}