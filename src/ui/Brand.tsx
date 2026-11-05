import { AppLink } from './AppLink';

export function Rays({ className = '' }: { className?: string }) {
  return <svg className={`rays ${className}`} viewBox="0 0 30 30" fill="none" aria-hidden="true"><path d="M7 10 9 3M14 13 20 8M17 19 25 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/></svg>;
}
export function Brand() {
  return <AppLink href="/" className="logo" ><span className="logo-word">Muso</span><Rays className="logo-rays" /></AppLink>;
}
