import type { ReactNode } from 'react';

export function AppLink({ href, children, className, onClick, current }: { href: string; children: ReactNode; className?: string; onClick?: () => void; current?: boolean }) {
  return <a href={href} className={className} aria-current={current ? 'page' : undefined} onClick={e => { if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); window.history.pushState({}, '', href); window.dispatchEvent(new PopStateEvent('popstate')); onClick?.(); }}>{children}</a>;
}
