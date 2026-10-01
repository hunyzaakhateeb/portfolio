# Hunyzaa Khateeb — Portfolio

A personal portfolio website showcasing my work across UI/UX design, visual design, creative development, and interactive experiences.

## Features

- Responsive portfolio layout with sections for selected work, about, communities, skills, education, experiences, and contact.
- Interactive hero with a pixel character, rotating dialogue, animated introduction, and section navigation.
- Fluid animated background that responds to pointer movement and respects reduced-motion preferences.
- Project cards with case-study modals and links to live projects.
- Contact form that opens the visitor’s default email app with their message prepared.
- Resume preview and a responsive navigation drawer.
- “Currently Building” card for the AI Floor Plan Generator project.

## Built with

- React 18
- Vite 5
- JavaScript and CSS
- WebGL canvas animation

## Getting started

### Requirements

Install Node.js and npm.

### Install dependencies

```sh
npm install
```

### Run the development server

```sh
npm run dev
```

Vite runs on port `3000` by default. If that port is already occupied, Vite will select another available port and print the local URL in the terminal.

### Build for production

```sh
npm run build
```

The production site is generated in `dist/`.

### Preview the production build

```sh
npm run preview
```

## Project structure

```text
public/                 Static images and project assets
logos/                  Contact and community logo images
src/
  components/            Portfolio sections and reusable UI
  App.jsx                Main page composition and scroll behavior
  main.jsx               React application entry point
  index.css              Global styles and design tokens
bg.js                    WebGL fluid background animation
index.html               HTML entry point and page metadata
vite.config.js           Vite configuration
```

## Current project

### AI Floor Plan Generator

An in-progress tool exploring how AI can turn 2D floor plans into interactive 3D spaces. Current areas of exploration include an editable 2D layout canvas, 2D-to-3D visualization, and machine-learning-assisted floor-plan generation. Future directions include AR/VR visualization.

**Planned stack:** React, Konva.js, Python, and PyTorch.

## Contact

- Email: [hunyzaak@gmail.com](mailto:hunyzaak@gmail.com)
- LinkedIn: [linkedin.com/in/hunyzaa-khateeb](https://www.linkedin.com/in/hunyzaa-khateeb/)
- GitHub: [github.com/hunyzaakhateeb](https://github.com/hunyzaakhateeb)
