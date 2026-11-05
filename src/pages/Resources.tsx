import { ButtonLink } from '../ui/Button';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { AppLink } from '../ui/AppLink';
import { Rays } from '../ui/Brand';
import { Footer } from '../layout/SiteLayout';
import { guides } from '../content/guides';
import { NotFound } from './NotFound';

export function GuideList() { return <div className="guide-grid">{guides.map((g, i) => <AppLink href={'/resources/' + g.slug} className={'guide-card guide-' + i} key={g.slug}><span className="guide-tag">{g.tag}</span><h3>{g.title}</h3><p>{g.description}</p><span className="guide-link">Read the guide <ArrowRight size={16} /></span></AppLink>)}</div>; }
export function Resources() { return <><main id="main" className="shell reading-page"><div className="page-heading"><BookOpen size={29}/><h1>A little help for your childcare hunt.<Rays className="heading-rays" /></h1><p>Thoughtful, practical guides for the questions that come up along the way.</p></div><GuideList /><div className="resource-note"><h2>Have a question we haven’t covered?</h2><p>Muso is growing, and we’d love to hear what would be helpful to your family.</p><a className="text-link" href="mailto:jamil.wahid08@gmail.com?subject=Muso%20feedback">Send us a note <ArrowRight size={17} /></a></div></main><Footer /></>; }
export function Article({ slug }: { slug: string }) {
  const guide = guides.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  return <><main id="main" className="article">
    <AppLink href="/resources" className="back-link"><ArrowLeft size={17} /> All resources</AppLink>
    <h1>{guide.title}</h1>
    <p className="article-intro">{guide.description} Every family is different, so start with the questions that matter most to yours.</p>
    <h2>{guide.sectionTitle}</h2>
    <ul>{guide.questions.map(question => <li key={question}>{question}</li>)}</ul>
    <p>{guide.closing}</p>
    <div className="article-next"><h2>Ready to explore?</h2><ButtonLink href="/find">Find childcare <ArrowRight size={18}/></ButtonLink></div>
  </main><Footer /></>;
}
