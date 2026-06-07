'use client';

import { cn } from '../../lib/utils';

// -------------------------------------------------------
// MODELS
// -------------------------------------------------------
// 1. Black Forest Labs
// -------------------------------------------------------

export function InlineBlackForestLabs({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="482"
      height="338"
      viewBox="0 0 482 338"
      className={cn(className)}
      {...props}
    >
      <path
        d="M342.2616 144.2684H291.2102L240.16 72.7939 80.9101 295.5154H132.0678L240.158 144.274 291.2077 144.273 183.1181 295.5154H234.4204L342.2616 144.2692 479.9996 336.9954H441.4717V336.998L399.4109 336.9974V295.678L342.2616 215.7437 285.431 295.5245V336.9945L153.4723 336.9954 153.4694 338H102.42L102.4228 336.9954H0L240.16 0Z"
        fill="#07130E"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function InlineBlackForestLabsLight({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="482"
      height="338"
      viewBox="0 0 482 338"
      className={cn(className)}
      {...props}
    >
      <path
        d="M342.2616 144.2684H291.2102L240.16 72.7939 80.9101 295.5154H132.0678L240.158 144.274 291.2077 144.273 183.1181 295.5154H234.4204L342.2616 144.2692 479.9996 336.9954H441.4717V336.998L399.4109 336.9974V295.678L342.2616 215.7437 285.431 295.5245V336.9945L153.4723 336.9954 153.4694 338H102.42L102.4228 336.9954H0L240.16 0Z"
        fill="#FAFAFA"
        fillRule="evenodd"
      />
    </svg>
  );
}

export const InlineByokModelProvider = InlineBlackForestLabs;
export const InlineByokModelProviderLight = InlineBlackForestLabsLight;
