export function Progress({ value = 0, className = '' }: { value?: number; className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-zinc-800/60 ${className}`} aria-valuenow={value}>
      <div className="h-full bg-white transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%' }} />
    </div>
  );
}
