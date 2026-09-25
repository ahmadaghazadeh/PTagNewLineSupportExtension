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

## Install on mobile (Android — Microsoft Edge Canary)

**Chrome for Android** does not load custom extensions. Use **Microsoft Edge Canary** (not stable Edge):

- [Google Play — Edge Canary](https://play.google.com/store/apps/details?id=com.microsoft.emmx.canary)
- [Café Bazaar — Edge Canary](https://cafebazaar.ir/app/com.microsoft.emmx.canary)

1. Install Edge Canary from one of the links above.
2. **Settings** → **About Microsoft Edge** → tap the build number **5 times** to enable **Developer options**.
3. On desktop: extract the extension ZIP, then **Pack extension** at `chrome://extensions` (Developer mode) to produce a **`.crx`** file.
4. Copy the `.crx` to your phone → Edge Canary **Settings** → **Developer options** → **Extension install by crx** → choose the file → **Add**.
5. Open [HomeworkStudent](https://alaviedu.ir/Student/HomeworkStudent) in Edge Canary and refresh.

Fallback: install on **desktop Chrome** with **Load unpacked**. See the [Persian landing page](docs/index.html) for step-by-step screenshots and links.

## Files

| File | Role |
|------|------|
| `manifest.json` | Extension manifest (MV3) |
| `content.js` | Enter → newline, textarea upgrade, dynamic pages |
| `content.css` | `.homework-text` line break display |

## Permissions

No special permissions — only runs on `alaviedu.ir` homework URLs via content scripts.
