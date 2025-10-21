import * as React from 'react';
export function Textarea({ className = '', ...props }: any) {
  return <textarea className={`min-h-[120px] rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 text-sm ${className}`} {...props} />;
}
