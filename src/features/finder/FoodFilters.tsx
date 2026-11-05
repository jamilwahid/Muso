import { choices } from './foodOptions';

export function FoodFilters({ selected, onChange }: { selected: string; onChange: (value: string) => void }) {
  return <div className="filter-toolbar">
    <div className="filter-options" role="group" aria-label="Food options">
      {choices.map(({ value, label, icon: Icon }) => <button key={value} type="button" className={selected === value ? 'filter active' : 'filter'} aria-pressed={selected === value} onClick={() => onChange(value)}><Icon size={16} aria-hidden="true"/>{label}</button>)}
    </div>
  </div>;
}
