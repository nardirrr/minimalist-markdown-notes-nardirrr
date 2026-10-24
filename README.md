# Minimalist Markdown Notes

A responsive, offline-first Markdown editor and live preview workspace built with Next.js, React, TypeScript, and Tailwind CSS. Hosted on Vercel's global edge network with zero server dependencies or external databases.

---

# Access live demo

https://minimalist-markdown-notes-nardirrr.vercel.app/



## Overview

This application provides a distraction-free drafting environment for structured notes and documentation. It pairs continuous parsing with immediate client-side persistence, ensuring data privacy and instant read/write cycles without transmitting user text across external networks.

### Key Capabilities
* **Reactive AST Parsing:** Renders Markdown directly into semantic HTML using `react-markdown` with syntax support for headers, emphasis, and itemised lists.
* **Offline-First Persistence:** Synchronises state directly with browser `localStorage`, preserving active sessions and documents across page reloads.
* **Dynamic Header Extraction:** Automatically parses the first Markdown heading (`# Title`) using regular expressions to dynamically update document tree labels in real time.
* **Zero Backend Exposure:** Sandboxes all note contents locally within the browser, avoiding database latency and external privacy trade-offs.
* **Theme & Layout Engine:** Features a split-pane workstation layout on desktop and an adaptive mobile drawer, coupled with persistent dark/light theme switching.

---

## Technical Stack

* **Framework:** Next.js (App Router, Turbopack)
* **Language:** TypeScript
* **State & Rendering:** React (`useState`, `useEffect`, unidirectional data flow)
* **Markdown Engine:** `react-markdown`
* **Styling:** Tailwind CSS (with responsive utilities and custom theme tokens)
* **Hosting / CI/CD:** Vercel (Edge Distribution)

---

## Architecture & Implementation Notes

### SSR Hydration Management
In Next.js, components pre-render server-side where the global `window` and `localStorage` APIs do not exist. To prevent runtime exceptions and hydration mismatches:
* Access to `localStorage` is deferred to a post-mount lifecycle hook (`useEffect`).
* Fallback states initialise smoothly on the initial paint before reading the cached notes array.

### Engineering Trade-offs & Profiling
* **Synchronous Storage Serialization:** The current MVP serialises the document collection directly to `localStorage` on state mutation. While sufficient for small note sets, high-frequency keystrokes run synchronous serialization operations on the main thread.
* **Future Optimisations:** Refactoring the write pipeline to use a debounced update hook (`useDebounce`) to throttle persistence cycles, and migrating large payloads to asynchronous browser storage via IndexedDB.

---

## Getting Started

### Prerequisites
* Node.js 18.x or later
* npm, yarn, or pnpm

### Installation & Run

1. Clone the repository:
   ```bash
   git clone [https://github.com/nardirrr/Minimal-Markdown-Notes.git]
   cd Minimal-Markdown-Notes

2. Run:
   ```bash
   npm run dev

3. Access the local host url for the browser
