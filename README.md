# Mark-Stephen-Rose.github.io

Personal website of Mark Rose: clinical data programmer and analyst, Stonehill College data science alum.

**Live site:** https://mark-stephen-rose.github.io/

## What's here

| Path | Purpose |
| --- | --- |
| `index.html` | The home page. Panels for About, Experience, Projects, Blog and Contact |
| `blog/<post>/index.html` | One folder per blog post, served at `/blog/<post>/` |
| `css/style.css` | All styling, including light/dark themes and the accent presets |
| `css/images/` | Headshot and the SVG icon sprite (`icons.svg`) |
| `js/theme-init.js` | Runs in `<head>` to apply the saved (or system) theme before first paint |
| `js/site.js` | Theme toggle, accent picker and mobile menu, shared by every page |
| `js/home.js` | Home page only: one-panel-at-a-time navigation and shareable project links |
| `Mark-Rose-Resume.pdf` | Current resume. Replace the file to update it; the URL stays the same |
| `404.html`, `robots.txt`, `sitemap.xml` | Error page and search-engine files |

Plain HTML, CSS and JavaScript with no build step. GitHub Pages serves the `main` branch directly.

## Preview locally

Pages use root-relative paths (`/css/style.css`), so open them through a local server rather than double-clicking the file:

```
python -m http.server 8000
```

Then visit http://localhost:8000/

## Adding a blog post

1. Copy an existing `blog/<post>/index.html` to a new folder.
2. Update the title, description, canonical URL, `og:` tags, date, tags and body.
3. Add a card for it to the Blog section of `index.html` and a line to `sitemap.xml`.

## Sharing a project

Each project card has a **Copy link** button. The link looks like `https://mark-stephen-rose.github.io/#asl-detector`. Opening it shows the Projects panel, scrolls to that project and briefly highlights it.
