import React, { useEffect, useRef } from 'react';
import BUBBLE_SPRITE_SHEET from '../../bubble-gum/bubble.png';

const CHARACTER_IMAGE = '/assets/hk.png';
const PIXEL_CHARACTER_IMAGE = '/assets/pixel-hk-sheet.png';
const CANVAS_SIZE = 480;
const SPRITE_FRAME_SIZE = { width: 400, height: 300 };
const BUBBLE_FRAME_COUNT = 21;
const BUBBLE_FRAME_DURATION = 100;
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

function drawBubbleFrame(canvas, spriteSheet, frameIndex) {
  const context = canvas.getContext('2d');
  if (!context || !spriteSheet) return;

  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  context.imageSmoothingEnabled = false;

  const sourceX = (frameIndex % 3) * SPRITE_FRAME_SIZE.width;
  const sourceY = Math.floor(frameIndex / 3) * SPRITE_FRAME_SIZE.height;
  const baseScale = Math.min(CANVAS_SIZE / SPRITE_FRAME_SIZE.width, CANVAS_SIZE / SPRITE_FRAME_SIZE.height);
  const renderScale = baseScale * 1.12;
  const renderWidth = SPRITE_FRAME_SIZE.width * renderScale;
  const renderHeight = SPRITE_FRAME_SIZE.height * renderScale;

  context.drawImage(
    spriteSheet,
    sourceX,
    sourceY,
    SPRITE_FRAME_SIZE.width,
    SPRITE_FRAME_SIZE.height,
    (CANVAS_SIZE - renderWidth) / 2,
    (CANVAS_SIZE - renderHeight) / 2,
    renderWidth,
    renderHeight
  );
}

export default function CharacterCanvas({ onCharacterClick, hoveredNavLink }) {
  const canvasRef = useRef(null);
  const spriteSheetsRef = useRef({ top: null, bottom: null });
  const gazeRef = useRef({ x: 0, y: 0, side: 'left', verticalSide: 'top' });
  const bubbleSpriteRef = useRef(null);
  const bubbleAnimationRef = useRef({ active: false, completed: false, frame: 0, direction: 1, lastFrameAt: 0, animationFrame: 0 });

  const drawCurrentFrame = () => {
    if (!canvasRef.current) return;

    const bubbleAnimation = bubbleAnimationRef.current;
    if (bubbleAnimation.active && bubbleSpriteRef.current) {
      drawBubbleFrame(canvasRef.current, bubbleSpriteRef.current, bubbleAnimation.frame);
      return;
    }

    drawCharacter(canvasRef.current, spriteSheetsRef.current, gazeRef.current);
  };

  const animateBubble = (timestamp) => {
    const animation = bubbleAnimationRef.current;
    if (!animation.active) return;

    if (!animation.lastFrameAt) animation.lastFrameAt = timestamp;
    const elapsedFrames = Math.floor((timestamp - animation.lastFrameAt) / BUBBLE_FRAME_DURATION);

    if (elapsedFrames > 0) {
      animation.lastFrameAt += elapsedFrames * BUBBLE_FRAME_DURATION;
      animation.frame += elapsedFrames * animation.direction;

      if (animation.direction > 0 && animation.frame >= BUBBLE_FRAME_COUNT - 1) {
        animation.frame = BUBBLE_FRAME_COUNT - 1;
        animation.active = false;
        animation.completed = true;
        animation.animationFrame = 0;
        drawCurrentFrame();
        return;
      }

      if (animation.direction < 0 && animation.frame <= 0) {
        animation.frame = 0;
        animation.active = false;
        animation.animationFrame = 0;
        drawCurrentFrame();
        return;
      }
    }

    drawCurrentFrame();
    animation.animationFrame = window.requestAnimationFrame(animateBubble);
  };

  const startBubbleAnimation = (event) => {
    if (event.button !== 0 || !event.isPrimary || !bubbleSpriteRef.current) return;
    if (event.pointerType === 'touch') event.preventDefault();

    const animation = bubbleAnimationRef.current;
    window.cancelAnimationFrame(animation.animationFrame);
    animation.active = true;
    animation.completed = false;
    animation.frame = 0;
    animation.direction = 1;
    animation.lastFrameAt = performance.now();
    drawCurrentFrame();
    animation.animationFrame = window.requestAnimationFrame(animateBubble);
  };

  const rewindBubbleAnimation = () => {
    const animation = bubbleAnimationRef.current;
    if (!animation.active || animation.completed || animation.direction < 0) return;

    animation.direction = -1;
    animation.lastFrameAt = performance.now();
    if (!animation.animationFrame) {
      animation.animationFrame = window.requestAnimationFrame(animateBubble);
    }
  };

  useEffect(() => {
    const loadSpriteSheet = (key, source) => {
      const image = new Image();
      image.onload = () => {
        spriteSheetsRef.current[key] = image;
        if (!canvasRef.current) return;
        if (canvasRef.current.width !== CANVAS_SIZE || canvasRef.current.height !== CANVAS_SIZE) {
          canvasRef.current.width = CANVAS_SIZE;
          canvasRef.current.height = CANVAS_SIZE;
        }
        drawCurrentFrame();
      };
      image.src = source;
      return image;
    };

    const topImage = loadSpriteSheet('top', CHARACTER_IMAGE);
    const bottomImage = loadSpriteSheet('bottom', PIXEL_CHARACTER_IMAGE);
    const bubbleImage = new Image();
    bubbleImage.onload = () => {
      bubbleSpriteRef.current = bubbleImage;
      drawCurrentFrame();
    };
    bubbleImage.src = BUBBLE_SPRITE_SHEET;

    const handlePointerRelease = () => rewindBubbleAnimation();
    window.addEventListener('pointerup', handlePointerRelease);
    window.addEventListener('pointercancel', handlePointerRelease);

    return () => {
      topImage.onload = null;
      bottomImage.onload = null;
      bubbleImage.onload = null;
      window.removeEventListener('pointerup', handlePointerRelease);
      window.removeEventListener('pointercancel', handlePointerRelease);
      window.cancelAnimationFrame(bubbleAnimationRef.current.animationFrame);
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
    if (canvasRef.current && !bubbleAnimationRef.current.active) {
      drawCharacter(canvasRef.current, spriteSheetsRef.current, nextGaze);
    }
  };

  const resetGaze = () => {
    const centeredGaze = { x: 0, y: 0, side: 'left', verticalSide: 'top' };
    gazeRef.current = centeredGaze;
    drawCurrentFrame();
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
        aria-label="Pixel character. Click to change dialogue; press and hold to blow a bubble."
        onPointerDown={startBubbleAnimation}
        onPointerLeave={rewindBubbleAnimation}
        onClick={onCharacterClick}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}