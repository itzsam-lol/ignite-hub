# Ignite Room — Official Community Website

A premium, production-ready website for **Ignite Room**, a student-led technology community focused on empowering learners, innovators, and builders.

## ✨ Features

- **3D Interactive Logo** — Scroll-reactive 3D flame logo using React Three Fiber
- **Smooth Animations** — Framer Motion scroll reveals and micro-interactions
- **Dark Theme** — Deep maroon-to-black gradients with fire-pink accents
- **Responsive Design** — Mobile-first, works on all devices
- **SEO Optimized** — Meta tags, semantic HTML, proper heading structure
- **Performance Focused** — Lazy loading, optimized assets, low-poly 3D

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Variables
- **Animations**: Framer Motion
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **UI Components**: Shadcn/ui (customized)
- **Icons**: Lucide React

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm**, **yarn**, **pnpm**, or **bun**

### Step 1: Clone the Repository

```bash
# Clone from GitHub (after connecting via Lovable Settings → GitHub)
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun (fastest)
bun install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The site will be available at **http://localhost:5173**

### Step 4: Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
ignite-room-website/
├── public/
│   └── models/
│       └── ignite-logo.glb      # 3D logo model (scroll-interactive)
├── src/
│   ├── assets/
│   │   └── ignite-logo.png      # 2D logo
│   ├── components/
│   │   ├── ui/                  # Shadcn components
│   │   ├── sections/            # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── TeamSection.tsx
│   │   │   ├── AppSection.tsx
│   │   │   └── CollaborationsSection.tsx
│   │   ├── Logo3DBackground.tsx # 3D interactive background
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   └── Index.tsx            # Main page
│   ├── index.css                # Design system & tokens
│   └── main.tsx                 # Entry point
├── tailwind.config.ts           # Tailwind configuration
├── vite.config.ts               # Vite configuration
└── index.html                   # HTML template with SEO meta
```

---

## 🎨 Design System

Colors are defined in `src/index.css` using HSL CSS variables:

| Variable | Description |
|----------|-------------|
| `--primary` | Fire pink-red accent (345° 100% 59%) |
| `--background` | Deep dark background |
| `--secondary` | Maroon-tinted secondary |
| `--gradient-hero` | Hero section gradient |
| `--gradient-text` | Gradient text effect |

### Typography
- **Headings**: Space Grotesk (Google Fonts)
- **Body**: Inter (Google Fonts)

---

## 🔧 Customization

### Updating Colors
Edit `src/index.css`:
```css
:root {
  --primary: 345 100% 59%;  /* Fire pink-red */
}
```

### Adding Team Members
Edit `src/components/sections/TeamSection.tsx`

### Adding Events
Edit `src/components/sections/EventsSection.tsx`

---
---

## ⚡ Performance Notes

- **3D Model**: `.glb` file is optimized and lazy-loaded
- **Images**: Use WebP for team photos
- **Fonts**: Preloaded via Google Fonts
- **Code Splitting**: 3D canvas loads via React Suspense

---

## 📄 License

MIT License — free to use for your community!
