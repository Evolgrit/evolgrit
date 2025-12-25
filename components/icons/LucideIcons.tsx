import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: Partial<IconProps> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

function SvgIcon(props: IconProps) {
  return <svg {...baseProps} {...props} />;
}

export function MoreHorizontal(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="6" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="18" cy="12" r="1" />
    </SvgIcon>
  );
}

export function Phone(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2L8 9.91a16 16 0 0 0 6.09 6.09l1.38-1.38a2 2 0 0 1 2-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </SvgIcon>
  );
}

export function Smile(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 15s4 4 8 4 8-4 8-4" />
      <line x1="9" x2="9" y1="9" y2="9.01" />
      <line x1="15" x2="15" y1="9" y2="9.01" />
      <circle cx="12" cy="12" r="10" />
    </SvgIcon>
  );
}

export function Paperclip(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M13.5 4.5 6 12a4 4 0 0 0 5.66 5.66l7.5-7.5a6 6 0 0 0-8.49-8.49L4.21 8.93" />
    </SvgIcon>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <line x1="12" x2="12" y1="19" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </SvgIcon>
  );
}

export function HelpCircle(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </SvgIcon>
  );
}

export function MessageCircle(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 11a8 8 0 0 1 13.86-5.14A7.9 7.9 0 0 1 19 11a8 8 0 0 1-8 8h-1l-4 3v-3a8 8 0 0 1-3-6Z" />
    </SvgIcon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </SvgIcon>
  );
}
