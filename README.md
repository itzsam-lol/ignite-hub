# Ignite Room Platform

The official frontend application and primary user interface for the Ignite Room Campus Ambassador Platform (igniteroom.in).

Built by Satyam (@itzsam-lol)

---

## Overview

The Ignite Room front-end is a high-performance, responsive React application engineered to serve the student community. It interfaces directly with the Ignite Hub API to provide authentication, real-time leaderboard rendering, task submission portals, and administrative dashboards. The UI emphasizes speed, accessibility, and a modern aesthetic suitable for a technology-focused organization.

## Core Architecture

- Framework: React 18
- Build System: Vite
- Language: TypeScript
- Routing: React Router
- State Management & Data Fetching: React Query / Context API
- Styling: Tailwind CSS
- Component Library: Radix UI / Shadcn
- Animation & 3D: Framer Motion, React Three Fiber (Three.js)
- Icons: Lucide React

## Application Structure

The application architecture follows a domain-driven component structure designed for scalability and maintainability.

- Layouts & Routing: Protected and public routing boundaries utilizing higher-order components to enforce authentication states.
- Authentication Flows: Comprehensive login, registration, and password recovery interfaces integrating securely with the backend JWT system.
- Ambassador Dashboard: Personalized portal displaying referral statistics, application status, and verified task counts.
- Task Submission Portal: Multipart form interfaces allowing ambassadors to report completed promotional tasks via Cloudinary-backed uploads.
- Global Leaderboard: Real-time, ranked display of all authorized ambassadors based on their aggregated task and referral scores.
- Administrative Interface: Secure portal for system administrators to review, approve, or reject ambassador applications and individual task submissions.

## Design System

The application utilizes a strict design system enforced through CSS variables and Tailwind configuration, ensuring consistency across all views.

- Color Palette: Anchored by a deep maroon-to-black gradient scheme with highly contrasted pink-red accents for primary calls to action.
- Typography: Utilitarian pairing of Space Grotesk for display headings and Inter for highly readable body copy.
- Interactive Elements: Scroll-reactive 3D elements (WebGL) and subtle micro-interactions powered by Framer Motion.

## Operations and Deployment

This repository serves the production frontend deployment for igniteroom.in.

### Required Environment Configuration

The application requires strict synchronization with the backend infrastructure. Ensure the following environment variables are present in the CI/CD pipeline or deployment environment (.env.production):

- VITE_API_BASE_URL: The absolute URL to the Ignite Hub API production deployment.
- VITE_RECAPTCHA_SITE_KEY: Required for secure form submissions (signup, tasks).

### Build Pipeline

The application relies on standard Node.js build pipelines optimized by Vite for rapid bundling and asset minification.

1. Dependency Resolution: npm install
2. Static Analysis: npm run lint
3. Production Build: npm run build

The resulting `dist` directory contains the highly optimized static assets ready for deployment to any static hosting provider or CDN (e.g., Vercel, Netlify, Cloudflare Pages).
