import * as React from 'react';
export function Input({ className = '', ...props }: any) {
  return <input className={`h-10 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 text-sm ${className}`} {...props} />;
}
