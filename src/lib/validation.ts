import { z } from "zod";

/**
 * Shared by the client form and the API route, so the browser and the server
 * enforce exactly the same rules.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  company: z
    .string()
    .trim()
    .max(120, "Company must be 120 characters or fewer.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(40, "Phone must be 40 characters or fewer.")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(3, "Please enter a subject.")
    .max(150, "Subject must be 150 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(20, "Please give us at least 20 characters so we can help.")
    .max(5000, "Message must be 5000 characters or fewer."),
  /**
   * Honeypot — hidden from humans, tempting to bots. Deliberately permissive:
   * a filled value must pass validation so the API can accept it silently
   * rather than answering with an error that identifies the trap field.
   */
  website: z.string().max(1000).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Flattens a zod error into one message per field, for form rendering. */
export function toFieldErrors(error: z.ZodError<ContactInput>): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof ContactInput] = issue.message;
    }
  }
  return errors;
}
