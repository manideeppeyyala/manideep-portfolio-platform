/**
 * Icon lookup for CMS-selected icons (skills, services, categories).
 *
 * The admin picks from `CONTENT_ICON_NAMES` — a constrained list — so a
 * content edit can never reference a glyph that doesn't exist, and the
 * bundle only ever includes icons we actually ship.
 */

import {
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  FileText,
  GitBranch,
  Globe,
  LayoutDashboard,
  LineChart,
  Lock,
  Palette,
  Rocket,
  Server,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  FileText,
  GitBranch,
  Globe,
  LayoutDashboard,
  LineChart,
  Lock,
  Palette,
  Rocket,
  Server,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  Users,
  Workflow,
  Wrench,
  Zap,
};

/** Offered in the admin icon picker. */
export const CONTENT_ICON_NAMES = Object.keys(ICONS);

export function ContentIcon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon size={size} className={className} aria-hidden />;
}
