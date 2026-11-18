import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * ErrorBoundary — one crashed section must not leave the whole site white.
 * main.tsx wraps the whole app; it can be used inside a page too:
 *   <ErrorBoundary><Gallery /></ErrorBoundary>
 * The error goes to console.error and is reported to the Werto preview.
 * TEXTS: the fallback's title and home link per <html lang> (uz/ru/en).
 */
const TEXTS: Record<string, [string, string]> = {
  uz: ["Sahifa ochilmadi", "Bosh sahifa"],
  ru: ["Страница не открылась", "На главную"],
  en: ["This page could not open", "Home page"],
};

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info?.componentStack);
    const w = typeof window !== "undefined" ? (window as any) : null;
    w?.__wertoReportError?.(error);
  }

  render() {
    if (!this.state.failed) return this.props.children ?? null;
    if (this.props.fallback !== undefined) return this.props.fallback;
    const lang = (typeof document !== "undefined" ? document.documentElement.lang : "").slice(0, 2);
    const [title, home] = TEXTS[lang] ?? TEXTS.uz;
    const base = (typeof window !== "undefined" && (window as any).__WERTO_BASE__) || "/";
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "system-ui, sans-serif", color: "#374151", padding: 24, textAlign: "center" }}>
        <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</p>
        <a href={base} style={{ color: "var(--accent, #4f46e5)", fontWeight: 600 }}>{home}</a>
      </div>
    );
  }
}
