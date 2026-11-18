/**
 * formMeta — submitForm's helper: the owner's spreadsheet and Telegram
 * show the fields by their names on the page.
 * `_labels` (JSON {"key":"Label"}), `_form` (the form's name), `_page`
 * (location.pathname), `_kind` (the form's data-werto-kind: "booking" —
 * the booking lands in the owner's Google Calendar), `_lang` (the page's <html lang>:
 * labels already in the owner's language are used as they are). Never
 * throws — the order goes through anyway.
 */
/** Text: one line, ≤ 60 characters, no trailing ":" or "*". */
function cleanText(v: string | null | undefined): string {
  const t = (v ?? "").replace(/\s+/g, " ").trim().replace(/[:*\s]+$/, "").trim();
  return t.length > 60 ? t.slice(0, 60).trim() : t;
}

/** A label's text — without the text of fields inside it (select options, input, button). */
function labelText(lab: Element): string {
  const c = lab.cloneNode(true) as Element;
  c.querySelectorAll("input, select, textarea, option, button").forEach((x) => x.remove());
  return cleanText(c.textContent);
}

/** The field's label on the page: <label for> → the wrapping <label> → aria-label → placeholder. */
function labelOf(form: HTMLFormElement, key: string, value: unknown): string {
  try {
    const esc = (s: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(s) : s.replace(/["\\]/g, "\\$&"));
    let el = form.querySelector<HTMLElement>(`[name="${esc(key)}"]`) ?? form.querySelector<HTMLElement>(`#${esc(key)}`);
    if (!el && value !== undefined && value !== null && String(value) !== "") {
      // A controlled kit field (no name): the only field holding the same value.
      const same = Array.from(form.querySelectorAll<HTMLInputElement>("input, textarea, select")).filter(
        (f) => f.name !== "_gotcha" && f.value === String(value),
      );
      if (same.length === 1) el = same[0];
    }
    if (!el) return "";
    if (el.id) {
      const lab = form.querySelector(`label[for="${esc(el.id)}"]`) ?? document.querySelector(`label[for="${esc(el.id)}"]`);
      const t = lab ? labelText(lab) : "";
      if (t) return t;
    }
    const wrap = el.closest("label");
    const w = wrap ? labelText(wrap) : "";
    if (w) return w;
    return cleanText(el.getAttribute("aria-label")) || cleanText(el.getAttribute("placeholder"));
  } catch {
    return "";
  }
}

/** The form's name: name/id → the nearest h1–h3 inside or above the form. */
function formName(form: HTMLFormElement): string {
  const own = cleanText(form.getAttribute("name")) || cleanText(form.getAttribute("aria-label"));
  if (own) return own;
  for (let el: HTMLElement | null = form; el; el = el.parentElement) {
    const h = el.querySelector("h1, h2, h3");
    if (h?.textContent) return cleanText(h.textContent);
  }
  return cleanText(form.id);
}

/** _labels, _form, _page, _kind, _lang — values the site sends itself win. */
export function formMeta(form: HTMLFormElement | null, sent: Record<string, unknown>): Record<string, unknown> {
  const meta: Record<string, unknown> = {};
  try {
    if (typeof window !== "undefined" && !sent._page) meta._page = window.location.pathname;
    if (typeof document !== "undefined" && !sent._lang) {
      const lang = cleanText(document.documentElement.lang).slice(0, 10);
      if (lang) meta._lang = lang;
    }
    if (!form) return meta;
    const kind = cleanText(form.getAttribute("data-werto-kind"));
    if (kind && !sent._kind) meta._kind = kind;
    if (!sent._form) {
      const name = formName(form);
      if (name) meta._form = name;
    }
    if (!sent._labels) {
      const labels: Record<string, string> = {};
      for (const key of Object.keys(sent)) {
        if (key.startsWith("_")) continue;
        const l = labelOf(form, key, sent[key]);
        if (l) labels[key] = l;
      }
      const json = JSON.stringify(labels);
      if (Object.keys(labels).length > 0 && json.length <= 4000) meta._labels = json;
    }
  } catch {
    /* meta is a courtesy — the order goes anyway */
  }
  return meta;
}
