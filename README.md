# Alavi Edu — New Line Support (Chrome extension)

Enables **line breaks** when writing or viewing homework on [alaviedu.ir HomeworkStudent](https://alaviedu.ir/Student/HomeworkStudent).

## راهنمای فارسی و صفحهٔ وب (GitHub Pages)

- Landing page (Persian): open [`docs/index.html`](docs/index.html) locally, or after publishing enable **GitHub Pages** from the `/docs` folder.
- Edit [`docs/site-config.js`](docs/site-config.js) and set `githubUser` to your GitHub username so **Download ZIP** and page URLs work.
- Shareable banner image: [`docs/assets/banner-fa.png`](docs/assets/banner-fa.png)

**GitHub Pages (free):** Repository → **Settings** → **Pages** → Branch `main`, folder **`/docs`**.

## What it fixes

1. **Display** — Text inside `<p class="homework-text">` is shown with `white-space: pre-wrap`, so line breaks in the HTML/text are visible (default `<p>` styling collapses them).
2. **Typing** — **Enter** inserts a new line in homework text areas instead of submitting the form or doing nothing (common on mobile).
3. **Single-line fields** — Plain `<input type="text">` homework fields are upgraded to a `<textarea>` so multiple lines are possible.

## Install on desktop Chrome

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked** → select this folder (`PTanNewLineSupportExtension`)

## Install on mobile (Android — Kiwi Browser)

**Chrome for Android** does not load custom extensions. **Kiwi** usually has **no “Load unpacked”** like desktop Chrome — install from the **ZIP file** only.

1. Download `PTagNewLineSupportExtension.zip` from the [Persian landing page](docs/index.html) (or build it from this repo).
2. In Kiwi, open `chrome://extensions` (or menu → **Extensions**).
3. Turn on **Developer mode**.
4. Tap **+** / **+(from .zip/.crx/.user.js)** and pick the **`.zip` file** (do **not** extract it first).
5. Reload `chrome://extensions` if the extension does not appear, then open [HomeworkStudent](https://alaviedu.ir/Student/HomeworkStudent) and refresh.

If choosing the ZIP does nothing (common on newer Android with the Google **Files** picker), try selecting the file via **Total Commander**, update Kiwi from Play Store, or install on **desktop Chrome** with **Load unpacked** instead.

Kiwi is no longer maintained (archived ~2025); **Edge Canary** (Android developer options) or desktop Chrome are fallbacks.

## Files

| File | Role |
|------|------|
| `manifest.json` | Extension manifest (MV3) |
| `content.js` | Enter → newline, textarea upgrade, dynamic pages |
| `content.css` | `.homework-text` line break display |

## Permissions

No special permissions — only runs on `alaviedu.ir` homework URLs via content scripts.
