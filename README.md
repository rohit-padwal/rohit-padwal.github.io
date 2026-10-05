# Rohit Padwal — portfolio

A static portfolio built with Vite, React, TypeScript, CSS Modules, and React Router's `BrowserRouter`. Built for **rohit-padwal/rohit-padwal.github.io**, deployed at **https://rohit-padwal.com/**. Vite's `base` is `/`. The original root `CNAME` is retained and copied byte for byte into the build.

## Run locally

Use Node.js **22.12+** (Node 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints, usually `http://127.0.0.1:5173`.

```sh
npm run build
npm test
npm run preview
```

The deployable site is in `dist/`; preview usually opens at `http://127.0.0.1:4173`. Build-time Node scripts generate static HTML. No server, PHP, backend, CMS, or runtime rewrites are required in production.

## Deploy to GitHub Pages with the existing custom domain

1. Review and commit the migration files, including `package-lock.json`, `.github/workflows/deploy.yml`, and the unchanged root `CNAME`. Keep `dist/` out of Git.
2. In **rohit-padwal/rohit-padwal.github.io → Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. Publishing the source branch directly will not build the React app.
3. Keep the existing custom domain **rohit-padwal.com** in Pages settings. Keep its existing DNS records. This migration requires no DNS change. Enable **Enforce HTTPS** when GitHub makes it available; canonical URLs use HTTPS.
4. Push to `main`, or run **Build and deploy portfolio to GitHub Pages** manually from Actions. The workflow installs locked dependencies, builds, verifies the content and routes, and uploads **only `dist/`**. Pull requests run verification without deploying.
5. Confirm the workflow succeeds. Verify `/`, `/blog`, `/projects/solidity-grammer-fuzzer`, and a refresh on the project URL at your custom domain. When you publish a post, verify `/blog/your-post-slug` too.
6. The output contains `CNAME`, `.nojekyll`, `404.html`, `index.html`, static route snapshots, assets, resume, `robots.txt`, and `sitemap.xml`. The artifact is served at the domain root, without a `/rohit-padwal.github.io/` prefix.

No remote settings have been changed, commits pushed, or deployment triggered by the migration itself.

## Activate the contact form

The original PHP form could not deliver messages on GitHub Pages. The replacement uses Formspree's client-side `fetch` API with `Accept: application/json`, validation, a honeypot, a timeout, loading/disabled submission state, a success message, and visible service/network errors. Entries stay intact after a failed submission.

**You confirmed that you do not currently have a Formspree endpoint.** The integration is implemented, but real delivery requires that account configuration. Until then, the form visibly explains that it is not connected and links to the original email address. It never reports a successful submission without a successful service response.

1. Create a form at [Formspree](https://formspree.io/), set its receiving address to `rohitpadwal.uta@gmail.com`, and complete any required verification.
2. Copy your form endpoint, in the form `https://formspree.io/f/your-form-id`.
3. For local development, copy `.env.example` to `.env.local` and set:

   ```dotenv
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
   ```

4. For GitHub Pages, add **Settings → Secrets and variables → Actions → Variables → New repository variable** named `VITE_FORMSPREE_ENDPOINT`, with that same URL as its value.
5. Rebuild/redeploy after changing it. Vite embeds public configuration at build time; this endpoint is public, not a secret API key. Never put private credentials in `VITE_*` values.
6. Send a real test message and verify delivery in the Formspree dashboard and receiving inbox. Automated tests simulate responses and do not send real messages.

Reference: [Formspree's AJAX documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax/).

## Content and project structure

```text
src/
  App.tsx                       Route definitions
  main.tsx                      BrowserRouter and static HTML hydration
  entry-server.tsx              Build-time HTML renderer; no deployed server
  global.css                    Palette, typography, spacing, focus tokens
  styles.module.css             Responsive component styles
  seo.ts                        Route metadata and structured data
  components/
    Layout.tsx                  Header/Nav, navigation, Footer
    Section.tsx                 Semantic section shell
    Icon.tsx                    Small code-native SVG icons
    Projects.tsx                ProjectCard and conditional ProjectLinks
    ContactForm.tsx             Static Formspree client
    Metadata.tsx                Metadata on client-side navigation
  pages/
    Home.tsx                    Every original active homepage section
    Details.tsx                 Projects, blog list, post, and not-found views
  content/
    portfolio.json              Original portfolio content and project records
    types.ts                    Project / BlogPost schemas
    index.ts                    Content exports
    project-links.ts            Conditional project CTA data
content/blog/
  post-template.md.example      Non-published Markdown template
build/content.ts                Frontmatter validation and reading time
scripts/build.ts                Build, static snapshots, sitemap, robots
public/404.html                 GitHub Pages SPA fallback
public/.nojekyll                Static hosting marker
vite.config.ts                  Root base, content loader, original asset copying
CNAME                           Original domain file, unchanged
assets/img/                     Original images, unchanged
resume/                         Original resume PDF, unchanged
legacy/index.html               Original homepage reference; template notices removed
assets/css/, assets/js/,        Original template retained for reference;
assets/vendor/, forms/          not loaded or shipped by the React app
inner-page.html,
portfolio-details.html          Template example pages retained; template notices removed
.github/workflows/deploy.yml     Build, checks, and Pages deployment
tests/                          Content, routing, form, layout, a11y checks
```

## Component and route mapping

| Original section | React component | Preserved anchor |
| --- | --- | --- |
| Header / navigation | `Layout` | All original navigation destinations |
| Hero | `Hero` | `#hero` |
| About | `About` | `#about` |
| Facts | `Facts` | `#facts` |
| Skills + Other Skills | `Skills` | `#skills` |
| Professional Work experience | `Experience` | `#workEx` |
| Projects | `Projects` + `ProjectCard` | `#portfolio` |
| Education | `Education` | `#education` |
| Download my resume | `Resume` | `#myresume` |
| Contact | `Contact` + `ContactForm` | `#contact` |
| Footer | `Layout` | Copyright and social links |

Routes: `/`, `/projects/:slug`, `/blog`, `/blog/:slug`, and a semantic not-found view for other URLs. All existing sections remain; Facts and Resume were kept in addition to the requested core component breakdown. Section order is adjusted to give experience and projects visual priority.

## Add or update a project

Edit the `projects` array in `src/content/portfolio.json`. No JSX change is required.

```ts
interface Project {
  slug: string;                   // Unique lowercase URL slug
  title: string;
  description: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  image?: { src: string; alt: string };
  tags?: string[];
}
```

When both URLs exist, both **GitHub** and **Live Demo** links appear on the card and detail page. When either is missing, its CTA is omitted. The six migrated projects have their exact original GitHub URLs; no demo URLs, categories, technologies, or longer project descriptions have been invented. Original stock portfolio images remain available, without being assigned to projects they did not represent.

A project detail page currently shows the original title, description, available links, optional image/tags, and links to the other projects. Add an image under `assets/img/` if needed and reference `/assets/img/your-image.jpg`.

## Add a blog post

Copy `content/blog/post-template.md.example` to `content/blog/your-post-slug.md`, replace the example with your own writing, and set `draft: false`. The file name becomes the route slug. No React code change is required.

```markdown
---
title: "Your title"
date: "2026-10-03"
tags: ["Java", "Distributed Systems"]
description: "Your short description"
draft: false
---

Your Markdown content.
```

- `title`, a valid `YYYY-MM-DD` date, `tags` as an array, and a nonempty body are required.
- `description` is optional; an excerpt is generated if omitted.
- `draft` is optional and defaults to `false`. Drafts are excluded from the browser bundle, static route snapshots, list, and sitemap.
- `readingTime` is calculated at build time at 200 words/minute, with a minimum of one minute. The post data includes `slug`, `title`, `date`, `tags`, `description`, `body`, `draft`, and `readingTime`.
- Markdown supports headings, code blocks, links, images, GFM tables and lists. Raw HTML is not executed. Use `##` for the first body heading, because the page already supplies the title as `h1`.
- Posts are sorted newest first. Changes hot reload during development. Publish by rebuilding and deploying.
- There are no invented published posts. The production blog initially shows a clear empty state. The template and test-only posts are never included in the production build.

## Design system

CSS Modules were selected to keep this bespoke layout readable and scoped, with shared CSS variables rather than utility classes throughout JSX.

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#EEF2F6` | Hero and Projects mist backgrounds |
| Surface | `#F8FAFB` | Chalk background for About and Education |
| Card | `#FCFDFD` | Skills, Projects, Education, and form panels |
| Ink | `#172D3C` | Headings, Experience section, and Footer |
| Muted | `#506274` | Supporting text |
| Blue | `#3154A0` | Primary actions, active navigation, and focus |
| Teal | `#126D65` | Skill bars, links, card hover borders, and Contact action |
| Amber | `#9B5B12` | Hero rule, Education dates, and Blog divider |
| Sage | `#E8F0ED` | Skills background and secondary hover surfaces |
| Line | `#CFDADF` | Borders and separators |

Manrope is used for headings, Source Sans 3 for body text, and IBM Plex Mono for dates/labels. Fonts are bundled and served locally. The scale uses 12/14/18/22/28/40px tokens with fluid hero and page headings. The 1160px content width, numbered sections, timeline, restrained project cards, and original photography establish the layout. Mobile and tablet use a keyboard-accessible navigation menu with Escape support. There are visible focus states, a skip link, semantic sections, correctly associated form labels, accessible error descriptions, and reduced-motion support.

The header gives navigation its own flexible width with evenly distributed 16px labels and 48px click targets; it collapses below 1280px. The visual pass keeps the original content and section order. Experience uses a navy timeline, Facts a lighter blue band, Skills sage panels, Projects mist cards, Education inset amber edges, Blog an editorial divider, and Contact a framed form. Existing `assets/img/hero-bg.jpg` stays in the hero; `assets/img/profile-img.jpg` becomes a larger framed About portrait. No additional photo attachments were received for this pass.

The hero has a single staggered entrance. Scroll groups use 620ms opacity/transform reveals with a small IntersectionObserver hook; links, buttons, and cards have restrained hover feedback. Static/no-JavaScript HTML stays visible. Keyboard focus reveals a group immediately. Reduced-motion mode disables entrances, reveals, hover translations, and smooth scrolling, including when the preference changes while the page is open. No animation library or component framework was added.

The requested **Senior Software Engineer — Backend & Distributed Systems** headline is new positioning explicitly requested in the brief. The original bio, including its “3 years” wording, and all recorded job titles remain unchanged. Observability and AI appear using the existing skill-category wording.

## Audit and preservation notes

The original project is a Bootstrap-based HTML/CSS/JS template, with nine active homepage sections, six projects, seven work entries, two education entries, six percentage skills, eight other-skill groups, four Facts counters, and two social links.

- The PHP form uses a placeholder `contact@example.com` recipient and refers to the missing `assets/vendor/php-email-form/php-email-form.php`. PHP cannot run on GitHub Pages. The replacement does not ship the PHP code.
- Gallery filtering, lightbox, testimonial slider, and portfolio-details slider code was unused on the active homepage. The old Bootstrap, AOS, Typed.js, Swiper, Waypoints, and PureCounter scripts are no longer loaded.
- Metadata descriptions and keywords were empty. The new build supplies canonical URLs, titles, descriptions, Open Graph/Twitter metadata, structured data, and a sitemap. Blog posts have individual static metadata and publication/tag fields.
- The old mobile navigation used a non-button icon, most contact labels incorrectly targeted `name`, images lacked useful alt text, and the footer credit used a 2px font. These are corrected.
- `inner-page.html` and `portfolio-details.html` are legacy examples using “Alex Smith” and unrelated sample projects. They are retained as source references but not published as your portfolio content. Commented-out testimonials and placeholder biography remain in the original snapshot.
- No original active section was removed. Text is extracted with browser-equivalent whitespace normalization; wording, punctuation, facts, dates (including `Janury`), URLs, and numbers are preserved. Facts numbers use readable thousands separators.
- Every original image, the resume PDF, and `CNAME` are checked byte for byte. The original homepage content is retained in `legacy/index.html`, with the template headers and footer credit removed as requested. Footer copyright and social links remain visible.

## Clean routes on GitHub Pages

The app uses `BrowserRouter`, with no hash-based routing. Following the [spa-github-pages pattern](https://github.com/rafgraph/spa-github-pages), `public/404.html` captures the full relative URL and redirects to `/index.html?__spa=...`. The early inline script in `index.html` decodes it using `URLSearchParams` and calls `history.replaceState` before React loads. Paths, query parameters, fragments, Unicode, and escaped ampersands survive the round trip. `__spa` is reserved for this fallback.

Known project/post routes also receive static `index.html` snapshots during build, for first-load content and metadata visible to crawlers and social previews. The SPA fallback covers URLs without a static snapshot. Hydration only happens when the snapshot matches the current route; after a 404 restoration to a nested route, React renders the restored route instead of hydrating the homepage snapshot.

The Pages test harness serves **real files or the actual 404 response**, rather than silently rewriting nested routes. Browser tests force a known project and test-only blog post through that fallback and verify the original clean URL, correct content, and refresh behavior. These are local checks; production domain behavior is not claimed until deployment is run.

Reference: [Vite's root/custom-domain GitHub Pages deployment guidance](https://vite.dev/guide/static-deploy#github-pages).

## Verification

```sh
npm run build
npm test
npx playwright install chromium
BLOG_CONTENT_DIR=tests/fixtures/blog BUILD_OUT_DIR=.test-dist VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/testendpoint npm run build
npm run test:e2e
```

The isolated browser-test build includes a test-only post and a fake endpoint whose requests are intercepted. It never replaces `dist/` and must not be deployed. Tests cover original text/links, byte-for-byte assets, conditional CTAs, frontmatter validation/drafts/reading time, static metadata, 404 encoding, project/blog direct loads and refreshes, client navigation, unknown routes, mobile/tablet/desktop overflow, keyboard focus and menu behavior, WCAG axe checks, and contact validation/success/service/network states. Live Formspree delivery requires your endpoint and a real test submission.
