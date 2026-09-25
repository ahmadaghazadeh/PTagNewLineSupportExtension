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

## Install on mobile

Standard **Chrome for Android** does not load extensions. Use a Chromium browser that supports extensions, for example:

- **Kiwi Browser** (Android): Menu → Extensions → Developer mode → load this folder (or install a packed `.zip` / from PC via USB), or
- **Lemur Browser**, **Yandex Browser** (where extension support is available)

Steps (Kiwi, typical):

1. Copy this project to the phone (or zip and extract).
2. Kiwi → Extensions → **+(from .zip/.crx/.user.js)** or developer load if available.
3. Open `https://alaviedu.ir/Student/HomeworkStudent` and reload the page.

## Files

| File | Role |
|------|------|
| `manifest.json` | Extension manifest (MV3) |
| `content.js` | Enter → newline, textarea upgrade, dynamic pages |
| `content.css` | `.homework-text` line break display |

## Permissions

No special permissions — only runs on `alaviedu.ir` homework URLs via content scripts.
