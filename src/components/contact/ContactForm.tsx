"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { contact } from "@/content/site";
import {
  contactSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Where the form posts. Defaults to the Next.js route handler; the static
 * export sets this to "/contact.php" so the same form works on Apache hosting.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";

type FormValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formMessage, setFormMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  function update(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const payload = {
      ...values,
      website: honeypotRef.current?.value ?? "",
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus("error");
      setFormMessage(contact.form.validationSummary);
      firstErrorRef.current?.focus();
      return;
    }

    setStatus("submitting");
    setErrors({});
    setFormMessage("");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data: { ok?: boolean; message?: string; errors?: FieldErrors } =
        await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrors(data.errors ?? {});
        setFormMessage(data.message ?? contact.form.errorBody);
        firstErrorRef.current?.focus();
        return;
      }

      setStatus("success");
      setValues(initialValues);
      setFormMessage("");
    } catch {
      setStatus("error");
      setFormMessage(contact.form.errorBody);
      firstErrorRef.current?.focus();
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-accent/40 bg-accent-soft p-8 text-center"
      >
        <CheckCircle2
          className="mx-auto h-10 w-10 text-accent"
          aria-hidden="true"
        />
        <h3 className="mt-4 text-lg font-semibold text-fg">
          {contact.form.successHeading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {contact.form.successBody}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Announced to screen readers whenever submission fails. */}
      <div
        ref={firstErrorRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={cn(
          "rounded-xl border border-red-500/40 bg-red-500/8 p-4",
          status === "error" && formMessage ? "block" : "hidden",
        )}
      >
        <p className="flex items-start gap-2.5 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">
              {contact.form.errorHeading}
            </strong>{" "}
            {formMessage}
          </span>
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          label={contact.form.fields.name.label}
          placeholder={contact.form.fields.name.placeholder}
          value={values.name}
          onChange={(value) => update("name", value)}
          error={errors.name}
          autoComplete="name"
          required
        />
        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          label={contact.form.fields.email.label}
          placeholder={contact.form.fields.email.placeholder}
          value={values.email}
          onChange={(value) => update("email", value)}
          error={errors.email}
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id={fieldId("company")}
          errorId={errorId("company")}
          label={contact.form.fields.company.label}
          placeholder={contact.form.fields.company.placeholder}
          value={values.company}
          onChange={(value) => update("company", value)}
          error={errors.company}
          autoComplete="organization"
        />
        <Field
          id={fieldId("phone")}
          errorId={errorId("phone")}
          label={contact.form.fields.phone.label}
          placeholder={contact.form.fields.phone.placeholder}
          value={values.phone}
          onChange={(value) => update("phone", value)}
          error={errors.phone}
          type="tel"
          autoComplete="tel"
        />
      </div>

      <Field
        id={fieldId("subject")}
        errorId={errorId("subject")}
        label={contact.form.fields.subject.label}
        placeholder={contact.form.fields.subject.placeholder}
        value={values.subject}
        onChange={(value) => update("subject", value)}
        error={errors.subject}
        required
      />

      <Field
        id={fieldId("message")}
        errorId={errorId("message")}
        label={contact.form.fields.message.label}
        placeholder={contact.form.fields.message.placeholder}
        value={values.message}
        onChange={(value) => update("message", value)}
        error={errors.message}
        multiline
        required
      />

      {/* Honeypot. Hidden from people, left in the DOM for bots to fill. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fieldId("website")}>
          Do not fill this in
          <input
            ref={honeypotRef}
            id={fieldId("website")}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {contact.form.submitting}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              {contact.form.submit}
            </>
          )}
        </Button>
        <p className="text-xs text-fg-subtle">{contact.formIntro}</p>
      </div>
    </form>
  );
}

function Field({
  id,
  errorId,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required = false,
  multiline = false,
}: {
  id: string;
  errorId: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const controlClasses = cn(
    "w-full rounded-xl border bg-canvas px-4 py-3 text-sm text-fg placeholder:text-fg-subtle/70",
    "transition-colors duration-200 outline-none",
    "focus:border-accent focus:ring-2 focus:ring-accent/25",
    error ? "border-red-500/70" : "border-line",
  );

  return (
    <div className={multiline ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-fg"
      >
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-fg-subtle">
            {" "}
            {contact.form.optionalSuffix}
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={6}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(controlClasses, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={controlClasses}
        />
      )}
      {error ? (
        <p
          id={errorId}
          className="mt-2 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
