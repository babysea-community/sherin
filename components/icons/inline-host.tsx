'use client';

import { cn } from '../../lib/utils';

// -------------------------------------------------------
// HOSTING PROVIDERS
// -------------------------------------------------------
// 1. Vercel
// 2. Netlify
// -------------------------------------------------------

export function InlineVercel({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1155"
      height="1000"
      viewBox="0 0 1155 1000"
      fill="none"
      className={cn(className)}
      {...props}
    >
      <path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="#000000" />
    </svg>
  );
}

export function InlineNetlify({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="113"
      viewBox="0 0 128 113"
      className={cn(className)}
      {...props}
    >
      <path
        fill="#05BDBA"
        d="M34.6 94.1h-1.2l-6-6v-1.2l9.2-9.2H43l.9.9v6.4l-9.3 9.1z"
      />
      <path
        fill="#05BDBA"
        d="M27.4 25.8v-1.2l6-6h1.2l9.2 9.2v6.4l-.8.8h-6.4l-9.2-9.2z"
      />
      <path
        fill="#014847"
        d="M80.5 74.6h-8.8l-.7-.7V53.3c0-3.7-1.4-6.5-5.8-6.6-2.3-.1-4.9 0-7.6.1l-.4.4v26.6l-.7.7h-8.8l-.7-.7v-35l.7-.7h19.8c7.7 0 13.9 6.2 13.9 13.9v21.9l-.9.7z"
      />
      <path
        fill="#05BDBA"
        d="M35.8 61.4H.7l-.7-.7v-8.8l.7-.7h35.1l.7.7v8.8l-.7.7z"
      />
      <path
        fill="#05BDBA"
        d="M127.3 61.4H92.2l-.7-.7v-8.8l.7-.7h35.1l.7.7v8.8l-.7.7z"
      />
      <path
        fill="#05BDBA"
        d="M58.9 27.1V.7l.8-.7h8.8l.7.7v26.3l-.7.7h-8.8l-.8-.6z"
      />
      <path
        fill="#05BDBA"
        d="M58.9 111.9V85.6l.7-.7h8.8l.7.7v26.3l-.7.7h-8.8l-.7-.7z"
      />
    </svg>
  );
}
