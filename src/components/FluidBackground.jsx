import React, { useEffect, useRef } from 'react';
import { initializeFluidBackground } from '../../bg.js';
import './FluidBackground.css';

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => initializeFluidBackground(canvasRef.current), []);

  return <canvas ref={canvasRef} className="fluid-background-canvas" aria-hidden="true" />;
}
