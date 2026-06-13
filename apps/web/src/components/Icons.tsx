import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function LeafMark({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 20c0-9 6-15 16-16-.5 9-6.5 16-16 16Z" />
      <path d="M4 20 14 10" />
      <path d="M8.5 16h3" />
      <path d="M12 12.5v3" />
    </svg>
  );
}

export function Aperture({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.31 8 5.74 9.94" />
      <path d="M9.69 8h11.48" />
      <path d="m7.38 12 5.74-9.94" />
      <path d="M9.69 16 3.95 6.06" />
      <path d="M14.31 16H2.83" />
      <path d="m16.62 12-5.74 9.94" />
    </svg>
  );
}

export function Droplet({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 2.5s6.5 7 6.5 11.5a6.5 6.5 0 1 1-13 0C5.5 9.5 12 2.5 12 2.5Z" />
      <path d="M9 14a3 3 0 0 0 3 3" opacity="0.5" />
    </svg>
  );
}

export function Sprout({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 20h10" />
      <path d="M12 20V9" />
      <path d="M12 9a5 5 0 0 0-5-5H4v1a5 5 0 0 0 5 5h3" />
      <path d="M12 11a5 5 0 0 1 5-5h3v1a5 5 0 0 1-5 5h-3" />
    </svg>
  );
}

export function Sun({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function Recycle({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="M14 16l-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12.012 3a1.785 1.785 0 0 1 1.575.91l3.852 6.694" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}

export function Idea({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.3c0-.7.4-1.4 1-2A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

export function Scanner({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function Upload({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

export function ArrowRight({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowLeft({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function Close({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function Check({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Sparkles({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Compass({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 8-4 8-4-2 8-6Z" />
    </svg>
  );
}

export function Crosshair({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" />
    </svg>
  );
}

export function Layers({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="m12.83 2.18 8.5 4.25c.41.21.67.61.67 1.07s-.26.86-.67 1.07l-8.5 4.25c-.52.26-1.14.26-1.66 0L2.67 8.57C2.26 8.36 2 7.96 2 7.5s.26-.86.67-1.07l8.5-4.25c.52-.26 1.14-.26 1.66 0Z" />
      <path d="m22 12-8.83 4.42a2 2 0 0 1-1.66 0L2 12" opacity="0.6" />
      <path d="m22 17-8.83 4.42a2 2 0 0 1-1.66 0L2 17" opacity="0.3" />
    </svg>
  );
}

export function Globe({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

export function LogOut({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function ChevronRight({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Clock({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function Mountain({ size = 24, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
