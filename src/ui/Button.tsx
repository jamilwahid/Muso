import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { AppLink } from './AppLink';

type Variant = 'primary' | 'outline';
const classes = (variant: Variant, className = '') => `button ${variant} ${className}`.trim();

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={classes(variant, className)} {...props} />;
}

export function ButtonLink({ href, children, variant = 'primary', className }: { href: string; children: ReactNode; variant?: Variant; className?: string }) {
  return <AppLink href={href} className={classes(variant, className)}>{children}</AppLink>;
}

export function ExternalButtonLink({ variant = 'outline', className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={classes(variant, className)} {...props} />;
}
