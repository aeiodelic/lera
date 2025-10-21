import * as React from 'react';
export function Button({ className = '', variant = 'default', size = 'md', ...props }: any) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition';
  const v = variant === 'secondary' ? 'bg-zinc-100 text-zinc-900 hover:opacity-90' :
           variant === 'ghost' ? 'bg-transparent hover:bg-white/5' :
           'bg-white text-zinc-900 hover:opacity-90';
  const s = size === 'lg' ? 'h-11 text-base' : size === 'sm' ? 'h-8 text-sm' : 'h-10 text-sm';
  return <button className={`${base} ${v} ${s} ${className}`} {...props} />;
}
