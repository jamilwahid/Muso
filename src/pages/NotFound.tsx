import { ButtonLink } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export function NotFound() {return <main id="main" className="not-found"><h1>We couldn’t find that page.</h1><p>Let’s get you back on track.</p><ButtonLink href="/">Back home <ArrowRight size={18}/></ButtonLink></main>}
