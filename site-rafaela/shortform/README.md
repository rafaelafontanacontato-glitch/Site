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
- `app.js` owns language switching, the work reel, and keyboard/pointer
  controls.
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

GitHub API checks showed `pull: true` and `push: false` for both the active
`mau-fontana` account and the stored `morisoinc` account. Do not assume a push
will work until repository access is granted or the owner uses the existing
Netlify deployment workflow.

## Media and maintenance

The archive contains 14 supplied clips across four categories. `assets-manifest.json`
records original filenames, dimensions, durations, and export paths. Full originals
were kept outside the repository; the deployed MP4s use H.264/AAC with faststart.
The supplied 360p clips retain their source resolution.

To add a project, export its MP4 and poster into `assets/videos/` and
`assets/posters/`, then add an entry to `portfolio.js`. Include `width` and `height`
so landscape videos get the wider presentation. Change the order of the entries
to reorder the archive. Titles, categories, and descriptions support `en` and `pt`;
client and year are optional. Do not edit `assets-manifest.json` to change the UI.

The page starts in English and remembers a visitor's explicit language choice in
its own local-storage key. It does not share language state with the cinema site.
Only the active video gets a source URL; the active and neighboring projects get
posters. Playback begins on user action, with native controls and sound. The reel
pauses when it leaves view or the tab becomes hidden. Arrow keys work when the
carousel area has focus; native video keyboard controls remain available.

## Verification for this change

- All 14 video exports decoded successfully; all 28 media/poster URLs returned 200.
- Direct `/shortform` navigation and refresh worked on the local static server.
- Browser playback, arrows, focused keyboard navigation, swipe, EN/PT, and portrait/
  landscape layouts were checked; phone widths of 320px and 390px had no page overflow.
- The cinema `index.html` stayed byte-identical to the production snapshot.
- JavaScript syntax and whitespace checks passed.

The scoped Netlify redirects must still be checked on a deployed preview/production
instance. Local Python hosting does not execute Netlify `_redirects` rules. Do not
claim the production URL has changed until a deployment is verified.
