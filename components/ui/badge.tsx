export function Badge({ className = '', children }: any) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${className}`}>{children}</span>
}
