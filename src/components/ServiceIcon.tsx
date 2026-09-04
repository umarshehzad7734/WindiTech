import {
  ClipboardList,
  Cloud,
  Code2,
  Database,
  Layers,
  Rocket,
  Smartphone,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Maps the `icon` key in src/content/site.ts to a lucide-react component. */
const icons: Record<string, LucideIcon> = {
  code: Code2,
  clipboard: ClipboardList,
  users: Users,
  database: Database,
  rocket: Rocket,
  workflow: Workflow,
  layers: Layers,
  smartphone: Smartphone,
  server: Cloud,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Code2;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}
