import { useState } from 'react';
import { Button, ButtonLink } from '../ui/Button';
import { FoodFilters } from '../features/finder/FoodFilters';
import { Details } from '../features/finder/Details';
import { choices } from '../features/finder/foodOptions';
import data from '../data/centers.json';
import type { Center } from '../types/center';

const swatches = [
  { name: 'Plum', token: '--color-ink' },
  { name: 'Tangerine', token: '--color-brand' },
  { name: 'Indigo', token: '--color-action' },
  { name: 'Mint', token: '--color-accent' },
  { name: 'Ivory', token: '--color-surface-warm' },
] as const;

/** Local-only reference for the components currently used by Muso. */
export function DesignPreview() {
  const [food, setFood] = useState(choices[0].value);
  const [showCentre, setShowCentre] = useState(false);
  const centre = (data as Center[])[0];
  return <main id="main" className="shell design-preview">
    <h1>Muso design foundations</h1>
    <p>A local reference for the colours and controls used in the site.</p>
    <section><h2>Colour</h2><div className="swatches">{swatches.map(item => <div key={item.token}><span className="swatch" style={{ background: `var(${item.token})` }} /><strong>{item.name}</strong><code>{item.token}</code></div>)}</div></section>
    <section><h2>Buttons and links</h2><div className="preview-controls"><Button>Primary action</Button><Button variant="outline">Secondary action</Button><ButtonLink href="/find">Find childcare</ButtonLink></div><p>Use Tab to check focus and point at a control to see its hover state.</p></section>
    <section><h2>Food filters</h2><p>These are the same interactive controls used on the map.</p><FoodFilters selected={food} onChange={setFood} /></section>
    <section><h2>Centre details</h2><p>The same compact panel used on Find, shown with a centre from the local dataset.</p><Button variant="outline" onClick={() => setShowCentre(true)}>Show centre sheet</Button>{showCentre && <div className="preview-sheet"><Details center={centre} close={() => setShowCentre(false)} /></div>}</section>
  </main>;
}
