import { useCallback, useRef, useState } from "react";
import { formMeta } from "./formMeta";

/**
 * useForm — small form state + submit. The FORMS POST rule (honeypot,
 * try/catch, response.ok) lives HERE — the AI does not rewrite it every time.
 *
 *   const form = useForm({ name: "", phone: "", message: "" });
 *   <Input value={form.values.name} onChange={(e) => form.setField("name", e.target.value)}
 *          error={form.errors.name} />
 *   <input {...form.honeypotProps} />          // the hidden _gotcha field
 *   if (!form.validate({ name: (v) => (v ? undefined : "Please enter your name") })) return;
 *   const ok = await form.submitForm(ENDPOINT); // true = accepted
 *
 * submitForm: JSON POST, adds `_gotcha`, catches network errors,
 * on 429 sends once more after 1.2 s, true only when
 * response.ok. The caller shows the success state itself
 * (not alert()).
 *
 * For the owner's spreadsheet and Telegram, submitForm adds on its own:
 * `_labels` — each field's label on the page (formMeta.ts),
 * `_form` — the form's name, `_page` — location.pathname. The form is
 * found through honeypotProps.
 */
export type Rule<T> = (value: any, values: T) => string | undefined;
export type Rules<T> = Partial<Record<keyof T, Rule<T>>>;

export function useForm<T extends Record<string, any>>(initial: T) {
  // Kit never takes the whole tree down: a missing initial is an empty form.
  const [values, setValues] = useState<T>(() => (initial ?? {}) as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  // The form element this hook serves — found through the honeypot input,
  // which every kit form renders inside it.
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }, []);

  const validate = useCallback(
    (rules: Rules<T>): boolean => {
      const next: Partial<Record<keyof T, string>> = {};
      for (const key of Object.keys(rules ?? {}) as (keyof T)[]) {
        const rule = rules[key];
        const message = typeof rule === "function" ? rule(values?.[key], values) : undefined;
        if (message) next[key] = message;
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [values],
  );

  const submitForm = useCallback(
    async (endpoint: string, extra: Record<string, unknown> = {}): Promise<boolean> => {
      setSubmitting(true);
      try {
        const body = JSON.stringify({ ...formMeta(formRef.current, { ...values, ...extra }), ...values, ...extra, _gotcha: honeypot });
        const send = () => fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body });
        let response = await send();
        // 429: one per second per IP — wait 1.2 s and send once more.
        if (response.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          response = await send();
        }
        return response.ok;
      } catch {
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [values, honeypot],
  );

  const reset = useCallback(() => {
    setValues((initial ?? {}) as T);
    setErrors({});
  }, [initial]);

  /** A hidden field bots fill in — people never see it. */
  const honeypotProps = {
    name: "_gotcha",
    tabIndex: -1,
    autoComplete: "off",
    "aria-hidden": true,
    style: { display: "none" },
    value: honeypot,
    onChange: (e: { target: { value: string } }) => setHoneypot(e.target.value),
    ref: (el: HTMLInputElement | null) => {
      formRef.current = el?.closest("form") ?? null;
    },
  } as const;

  return { values, errors, setField, setErrors, validate, submitting, submitForm, reset, honeypotProps };
}

