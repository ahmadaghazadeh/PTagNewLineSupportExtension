(function () {
  "use strict";

  const MARK = "data-ptan-newline";
  const BIDI_MARK = "data-ptan-bidi";
  const ENHANCED = "ptan-newline-enhanced";

  const ARABIC_SCRIPT_RE =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const LATIN_RE = /[A-Za-z]/;
  const ARABIC_SPLIT_RE =
    /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)/g;

  const HOMEWORK_SELECTOR =
    "textarea, input[type='text'], input:not([type]), [contenteditable='true']";

  function isHomeworkArea(root) {
    if (!root || root === document.body) return true;
    const id = (root.id || "").toLowerCase();
    const cls = (root.className || "").toString().toLowerCase();
    const name = (root.getAttribute("name") || "").toLowerCase();
    const hint = `${id} ${cls} ${name}`;
    return /homework|تکلیف|hw/i.test(hint) || root.querySelector?.(".homework-text");
  }

  function shouldEnhance(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.getAttribute(MARK) === "true") return true;
    if (el.closest("p.homework-text, .homework-text") && !el.isContentEditable) {
      return false;
    }
    const form = el.closest("form");
    if (form && isHomeworkArea(form)) return true;
    if (isHomeworkArea(el.closest("[class*='homework'], [id*='homework'], [class*='Homework'], [id*='Homework']"))) {
      return true;
    }
    if (document.querySelector(".homework-text") && el.matches("textarea, input[type='text']")) {
      return true;
    }
    return el.matches("textarea");
  }

  function insertNewlineAtCursor(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    textarea.value = value.slice(0, start) + "\n" + value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function onEnterKeydown(e) {
    if (e.key !== "Enter" || e.isComposing) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const target = e.target;
    if (target instanceof HTMLTextAreaElement && shouldEnhance(target)) {
      e.preventDefault();
      e.stopPropagation();
      insertNewlineAtCursor(target);
      return;
    }

    if (
      target instanceof HTMLElement &&
      target.isContentEditable &&
      shouldEnhance(target)
    ) {
      e.preventDefault();
      e.stopPropagation();
      document.execCommand("insertLineBreak");
    }
  }

  function upgradeTextInputToTextarea(input) {
    if (!(input instanceof HTMLInputElement)) return;
    if (input.type && input.type !== "text") return;
    if (!shouldEnhance(input)) return;
    if (input.getAttribute(MARK) === "true") return;

    const ta = document.createElement("textarea");
    ta.value = input.value;
    ta.name = input.name;
    ta.id = input.id;
    ta.className = `${input.className} ${ENHANCED}`.trim();
    ta.required = input.required;
    ta.placeholder = input.placeholder;
    ta.disabled = input.disabled;
    ta.readOnly = input.readOnly;
    ta.setAttribute(MARK, "true");
    if (input.style.cssText) ta.style.cssText = input.style.cssText;
    input.replaceWith(ta);
  }

  function enhanceTextarea(ta) {
    if (!(ta instanceof HTMLTextAreaElement)) return;
    if (!shouldEnhance(ta)) return;
    ta.setAttribute(MARK, "true");
    ta.classList.add(ENHANCED);
    if (!ta.rows || ta.rows < 4) ta.rows = 6;
    ta.wrap = "soft";
  }

  function enhanceContentEditable(el) {
    if (!el.isContentEditable || !shouldEnhance(el)) return;
    el.setAttribute(MARK, "true");
    el.style.whiteSpace = "pre-wrap";
  }

  function isMixedPersianEnglish(text) {
    return ARABIC_SCRIPT_RE.test(text) && LATIN_RE.test(text);
  }

  function isDisplayHomeworkText(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return false;
    if (el.isContentEditable) return false;
    return el.matches("p.homework-text, .homework-text");
  }

  function wrapEnglishRunsInTextNode(textNode) {
    const text = textNode.nodeValue;
    if (!text || !LATIN_RE.test(text)) return;

    if (!ARABIC_SCRIPT_RE.test(text)) {
      const span = document.createElement("span");
      span.className = "ptan-en-segment";
      span.setAttribute("dir", "ltr");
      span.textContent = text;
      textNode.replaceWith(span);
      return;
    }

    const parts = text.split(ARABIC_SPLIT_RE);

    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (LATIN_RE.test(part)) {
        const span = document.createElement("span");
        span.className = "ptan-en-segment";
        span.setAttribute("dir", "ltr");
        span.textContent = part;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    }

    textNode.replaceWith(frag);
  }

  function enhanceMixedBidi(el) {
    if (!isDisplayHomeworkText(el)) return;
    if (el.getAttribute(BIDI_MARK) === "true") return;
    const fullText = el.textContent || "";
    if (!isMixedPersianEnglish(fullText)) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".ptan-en-segment")) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const node of textNodes) {
      wrapEnglishRunsInTextNode(node);
    }

    el.classList.add("ptan-mixed-bidi");
    el.setAttribute(BIDI_MARK, "true");
  }

  function scanBidi(root) {
    root.querySelectorAll("p.homework-text, .homework-text").forEach((el) => {
      enhanceMixedBidi(el);
    });
  }

  function scan(root) {
    root.querySelectorAll(HOMEWORK_SELECTOR).forEach((el) => {
      if (el instanceof HTMLInputElement) upgradeTextInputToTextarea(el);
      else if (el instanceof HTMLTextAreaElement) enhanceTextarea(el);
      else if (el instanceof HTMLElement && el.isContentEditable) enhanceContentEditable(el);
    });
    scanBidi(root);
  }

  document.addEventListener("keydown", onEnterKeydown, true);
  document.addEventListener(
    "keypress",
    (e) => {
      if (e.key !== "Enter") return;
      const t = e.target;
      if (t instanceof HTMLTextAreaElement && shouldEnhance(t)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  scan(document);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          scan(node);
        }
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
