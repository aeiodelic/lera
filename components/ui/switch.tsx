export function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onCheckedChange(!checked)} className={`h-6 w-11 rounded-full ${checked ? 'bg-white' : 'bg-zinc-700'} relative transition`}>
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-zinc-900 transition ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}
