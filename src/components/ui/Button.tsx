import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button — the one button.
 *
 * Props: variant? "primary" | "secondary" | "ghost" (default primary),
 * loading? (spinner + not clickable), fullWidth?, className? + <button>
 * props. type DEFAULTS to "button" — the button that submits a form gets
 * type="submit" EXPLICITLY (no accidental submits).
 * Height ≥ 44px (finger-sized).
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: "bg-[color:var(--accent)] text-white hover:opacity-90",
  secondary: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "bg-transparent text-[color:var(--accent)] hover:bg-gray-100",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading = false, fullWidth = false, type = "button", disabled, className = "", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-medium " +
        "transition focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-60 " +
        `${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`
      }
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
});
