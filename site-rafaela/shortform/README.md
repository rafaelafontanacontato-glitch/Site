# Short-form portfolio

This directory is a self-contained static page for Rafaela's video-editing
portfolio. It is mounted at `/shortform/` on the existing site, alongside the
original one-page portfolio at `/`. Keep the parent `site-rafaela/` directory
as the Netlify publish directory so both pages and the existing media remain in
the same deploy.

## Preview locally

The page uses ES modules and loads the 3D GLB model, so preview it over HTTP
instead of opening `index.html` directly:

```bash
python3 -m http.server 4173 --directory site-rafaela
```

Then open <http://127.0.0.1:4173/shortform/>. Stop the server with `Ctrl-C`.
There is no package manager, build step, or local dependency install. Three.js
and `GLTFLoader` are vendored in `vendor/` so the page can be deployed as
static files.

## Editing content

- `index.html` contains the page structure, metadata, and accessible labels.
- `styles.css` contains the visual system and responsive layout.
- `app.js` owns language switching, the format accordions, and the accessible playback dialog.
- `portfolio.js` is the content manifest for the selected videos. Add a
  project there with English and Portuguese fields, a poster, and a video URL.
- `hero.js` controls the interactive computer model. The optimized model is
  `assets/computer-web.glb`; `CREDITS.md` records its source and licenses.

The portrait and favicon intentionally reuse files from `../assets/`. Keep
those relative paths intact when moving or previewing the page.

## Routing and deployment

The current production site is hosted by Netlify at
`https://rafaelafontana.com/`, with the Netlify site alias
`effulgent-snickerdoodle-beae6b.netlify.app`. The repository is
`rafaelafontanacontato-glitch/Site`; it has no framework build configuration or
GitHub Actions workflow. Publish the complete `site-rafaela/` directory so the
legacy root page, its assets, and `/shortform/` are deployed together.

The root `_redirects` file contains a single-page fallback for the original
hash-routed portfolio. The `/shortform` redirect rules must stay above that
fallback: `/shortform` redirects to `/shortform/`, `/shortform/` serves this
directory's `index.html`, and an explicit scoped fallback prevents unknown
short-form paths from being rewritten to the legacy root. Keep the existing
`/* /index.html 200` rule last. A deploy should preserve the root page byte for
byte; verify it before and after publishing.

Useful checks after a deploy:

```bash
curl -sSIL https://rafaelafontana.com/shortform
curl -sSIL https://rafaelafontana.com/shortform/
curl -sSIL https://rafaelafontana.com/shortform/assets/computer-web.glb
curl -sS https://rafaelafontana.com/ | shasum -a 256
```

At the time this documentation was written, the live `/shortform` path still
served the legacy root page because the new section had not been deployed.
The apex uses `75.2.60.5`; `www` is a CNAME to the Netlify alias and redirects
to the apex over HTTPS.

Use `morisoinc` for GitHub authentication and commit authorship. Signed commits
use the configured 1Password signing integration.

## Media and maintenance

The archive contains 15 supplied clips across B-roll, Talking head, Real estate,
Brand storytelling, and VJ, plus two YouTube projects. YouTube titles and thumbnails
come from the videos’ public oEmbed metadata. `assets-manifest.json` records
original filenames, dimensions, durations, and export paths. Full originals are
kept outside the repository. The VJ visualizer is a silent 7.59-second loop,
resized from 4K to 1280×720 for web playback. Existing clips were preserved.

`portfolio.js` exports both `categories` and `portfolio`. Each item has a
`categoryId` matching a category. Reorder the category list to reorder the drawers,
or reorder portfolio items to change their order inside each category. Titles,
categories, and descriptions support `en` and `pt`; client and year are optional.

For direct media, put MP4s/posters into `assets/videos/` and `assets/posters/`, then
add an entry with `video`, `poster`, `width`, and `height`. For YouTube, use a
`youtubeId` instead of `video`; embeds load only after selecting a project.
Optional `startSeconds` preserves a timestamp from the supplied link (110 and 847
seconds for the current projects). An
optional `loop: true` repeats a clip. Do not edit `assets-manifest.json` to change
the UI.

The page starts in English and remembers the visitor's language independently of
the cinema site. Only one category opens at a time. Thumbnails are lazy-loaded;
video sources and YouTube frames are created on deliberate project selection.
Closing the dialog, including with Escape, unloads media and restores focus to
the selected thumbnail. Native videos pause when the tab becomes hidden.

## Verification for this change

- Existing 14 clips were previously verified; the new VJ export decodes successfully.
- All 30 direct-media/poster URLs resolve locally.
- Direct `/shortform` navigation and refresh worked on the local static server.
- Category exclusivity/counts, keyboard focus, VJ playback/loop, Escape cleanup,
  EN/PT, and a 390px phone layout were checked in the browser.
- The Portuguese blue text block uses a 1.2 line height to separate accented lines.
- The cinema `index.html` stayed byte-identical to the production snapshot.
- JavaScript syntax and whitespace checks passed.

The scoped Netlify redirects must still be checked on a deployed preview/production
instance. Local Python hosting does not execute Netlify `_redirects` rules. Do not
claim the production URL has changed until a deployment is verified.
