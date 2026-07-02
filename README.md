# Smart Document Tools

A production-ready, SEO-optimized, Next.js 14 application offering privacy-friendly, entirely browser-based tools for document and image manipulation.

## Features Completed in Core Initialization
- Next.js 14 App Router, TypeScript, Tailwind CSS structure.
- "Million-Dollar" UX Layout (Header, Footer, Home, Tools Directory).
- **Image to PDF**: Client-side PDF generation using `pdf-lib`.
- **Image Compressor**: Client-side image compression using `browser-image-compression`.

## Important Prerequisites
This project requires Node.js to build and run. 
1. Download and install Node.js from [nodejs.org](https://nodejs.org/). Ensure you download the "LTS" (Long Term Support) version.
2. During installation, make sure the option to add Node to PATH is selected (usually default).
3. Restart your computer or terminal to apply PATH changes.

## Setup Instructions

Once Node.js is installed, open your terminal (PowerShell or Command Prompt) in this project's directory (`d:\Website`) and run:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

## Adding More Tools
To add additional tools as planned:
1. Create a new folder under `app/tools/[tool-name]`.
2. Add a `page.tsx` file exporting a default React component.
3. Import the required utility libraries (e.g., `pdf-lib` for PDFs, or standard HTML5 Canvas for image manipulation).
4. Follow the structural pattern used in `app/tools/image-to-pdf/page.tsx` to maintain UI consistency and ensure processing happens entirely on the client side (`"use client";`).
