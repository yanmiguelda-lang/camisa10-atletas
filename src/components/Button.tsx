"use client";

import Link from "next/link";
import { playClickSound } from "@/lib/sound";

export type ButtonVariant = "primary" | "secondary" | "outline-light" | "outline-dark" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
};

type AsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: undefined;
};

type AsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type Props = AsLink | AsButton;

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "10px 18px", fontSize: 13 },
  md: { padding: "14px 26px", fontSize: 15 },
  lg: { padding: "16px 32px", fontSize: 16 },
};

export default function Button(props: Props) {
  const { variant = "primary", size = "md", fullWidth = false, className = "", style, children, disabled } = props;

  const classes = `btn-c10 btn-c10-${variant} ${className}`.trim();
  const combinedStyle: React.CSSProperties = {
    ...SIZE_STYLES[size],
    ...(fullWidth ? { width: "100%" } : null),
    ...style,
  };

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
        style={combinedStyle}
        onClick={() => {
          playClickSound();
          onClick?.();
        }}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", onClick } = props as AsButton;
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      style={combinedStyle}
      onClick={(e) => {
        playClickSound();
        onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}
