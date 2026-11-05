import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppLink } from '../ui/AppLink';
import { Brand } from '../ui/Brand';

export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const items = [{ href: '/find', label: 'Find childcare' }, { href: '/resources', label: 'Resources' }, { href: '/about', label: 'About' }];
  return <header className="site-header"><div className="header-inner"><Brand /><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">{items.map(item => <AppLink key={item.href} href={item.href} current={item.href === path || (item.href === '/resources' && path.startsWith('/resources/'))} className={item.href === path || (item.href === '/resources' && path.startsWith('/resources/')) ? 'active' : undefined} onClick={() => setOpen(false)}>{item.label}</AppLink>)}</nav></div></header>;
}
export function Footer() { return <footer className="footer"><div className="footer-inner"><div><Brand /><p>Made with care for families in Toronto.</p></div><div className="footer-links"><AppLink href="/find">Find childcare</AppLink><AppLink href="/resources">Resources</AppLink><AppLink href="/about">About</AppLink><a href="mailto:jamil.wahid08@gmail.com?subject=Muso%20feedback">Send feedback</a></div></div><div className="footer-bottom">Your sidekick in the childcare hunt.</div></footer>; }
