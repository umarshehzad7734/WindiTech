type ClassValue = string | false | null | undefined | ClassValue[];

/** Joins class names, ignoring falsy values and flattening nested arrays. */
export function cn(...classes: ClassValue[]): string {
  const out: string[] = [];
  for (const value of classes) {
    if (!value) continue;
    out.push(Array.isArray(value) ? cn(...value) : value);
  }
  return out.filter(Boolean).join(" ");
}
