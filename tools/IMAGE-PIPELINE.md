# Image & Media Standard (production)

**This is mandatory for every image on this site. No exceptions.**
Run [optimize-images.ps1](optimize-images.ps1) on every new photo before it is referenced.

## Rules
1. **Preserve the original** → copied to `source-materials/originals/` (git-ignored, never deployed).
2. **Convert JPG/JPEG/PNG → WebP**, quality **82** (range 80–85), metadata **stripped** (`-strip`).
3. **Responsive widths:** 400 (thumb), 800 (medium), 1600 (large), 1920 (hero).
   Skip any width larger than the source — **never upscale**. Largest served is capped at 1920.
4. **Aspect ratio preserved** (width-only resize).
5. **SEO filenames:** `descriptive-kebab-case-<width>.webp` (e.g. `cnc-turning-787.webp`).
6. **Responsive markup:** `<img srcset="… 400w, … 800w, … 1600w" sizes="…" loading="lazy" decoding="async" width height alt>`
   - Hero/LCP images: NOT lazy (eager); everything else: `loading="lazy"`.
   - Browser picks the right file by viewport + device pixel ratio.
7. **Never serve the raw original** on a public page (originals stay in `source-materials/`).
8. **Always set `width`/`height`** (or aspect-ratio) to prevent layout shift (CLS / Core Web Vitals).

## How to run
```powershell
# normal content/gallery image:
./tools/optimize-images.ps1 -InputPath .\source-materials\originals\my-photo.jpg -Name cnc-milling-5axis
# hero/banner image (adds the 1920 tier):
./tools/optimize-images.ps1 -InputPath .\source-materials\originals\factory.jpg -Name soar-factory-hero -Hero
```
It prints a paste-ready `<img>` snippet. Drop it in, then set a real `alt` and `sizes`.

## Open Graph (social share) images
- One branded card per site at `src/assets/images/og-soar-cnc.jpg` (1200×630).
- Kept as **JPG** (not WebP) — some social scrapers (LinkedIn, etc.) don't render WebP OG images.
- Referenced via `og:image` + `twitter:image` on every content page.
- Regenerate with ImageMagick (see commit history for the command) if branding changes.

## Dependencies
- **ImageMagick** (`magick`) — already installed at `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\`.
- Per project rule: **ask before installing** any new software.
