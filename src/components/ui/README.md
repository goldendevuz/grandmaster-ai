# ui/ — Werto base components (ready and tested — DO NOT MODIFY)

Every form field comes from here. A raw `<input>` lives only inside this
folder. The color is `--accent` in `src/index.css`. Import with a RELATIVE path:
from a page `"../components/ui"`, from `src/components/X.tsx` `"./ui"`.

Common props (fields): `label?`, `required?` (* next to the label), `hint?`,
`error?` (red text below), `className?`, `id?`, `name?`, `disabled?`.

- `Input` — plain `<input>` props (`value`, `onChange`, `placeholder`, `type`).
- `Textarea` — `rows?` (default 4) + `<textarea>` props.
- `Select` — `options: {value, label}[]` or `<option>` children (both work), `placeholder?` + `<select>` props.
- `Checkbox` — `label` (text/JSX), `checked`, `onChange`.
- `PhoneInput` — `value` (E.164 "+998887654323" or ""), `onChange(e164, {country, iso, valid})`, `defaultCountry?` (ISO2; default — the site's language),
  `placeholder?`. Mask, "+", paste — handled by the component.
- `EmailInput` — `value`, `onChange` (plain), `errorText?`; validates itself on blur.
  `isValidEmail(v)` — for the check on submit.
- `Button` — `variant?: "primary" | "secondary" | "ghost"`, `loading?`, `fullWidth?`;
  `type` defaults to "button" — the submit button needs `type="submit"`.
- `ErrorBoundary` — `children`, `fallback?`; a section that crashes inside it does not leave the whole site white (main.tsx already wraps the app).
- `FormField` — `label`, `required`, `hint`, `error`, `children` (for your own field).
- `BookingSlots` — the time in a booking form: `endpoint` (the form endpoint), `date` (YYYY-MM-DD), `value`, `onChange(time)`,
  `from?`/`to?` ("09:00"/"18:00"), `step?` (60), `duration?`. Taken times are disabled (only bookings that came through the site).
  A booking form is marked with `data-werto-kind="booking"`: fields `date`, `time`, `duration?`, `service`, `name`, `phone`.
- `useForm(initial)` → `{ values, errors, setField(name, v), validate(rules), submitting,
  submitForm(endpoint) → Promise<boolean>, reset, honeypotProps }`.

```tsx
import { Button, EmailInput, Input, PhoneInput, useForm } from "../components/ui";

const form = useForm({ name: "", phone: "", email: "" });
<Input label="Name" required value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} error={form.errors.name} />
<PhoneInput label="Phone" required value={form.values.phone} onChange={(v) => form.setField("phone", v)} error={form.errors.phone} />
<EmailInput label="Email" value={form.values.email} onChange={(e) => form.setField("email", e.target.value)} />
<input {...form.honeypotProps} />
<Button type="submit" loading={form.submitting}>Send</Button>
```
