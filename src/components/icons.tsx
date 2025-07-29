import type { SVGProps } from "react";

export function LitsenseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 6.5A5.5 5.5 0 0 1 17.5 12a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 6.5 12 5.5 5.5 0 0 1 12 6.5z" />
        <path d="m12 12 4.5 4.5" />
        <path d="M21.17 14.83a2.39 2.39 0 0 1-2.34 2.34" />
        <path d="M14.83 2.83a2.39 2.39 0 0 1 2.34 2.34" />
        <path d="M2.83 9.17a2.39 2.39 0 0 1 2.34-2.34" />
        <path d="M9.17 21.17a2.39 2.39 0 0 1-2.34-2.34" />
    </svg>
  );
}
