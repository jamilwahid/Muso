import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from './layout/SiteLayout';
import { Home } from './pages/Home';
import { Resources, Article } from './pages/Resources';
import { About } from './pages/About';
import { DesignPreview } from './pages/DesignPreview';
const Find = lazy(() => import('./features/finder/Find').then(module => ({ default: module.Find })));
import { NotFound } from './pages/NotFound';

function App() { const [path,setPath]=useState(window.location.pathname.replace(/\/$/,'')||'/');useEffect(()=>{const update=()=>{setPath(window.location.pathname.replace(/\/$/,'')||'/');window.scrollTo(0,0)};window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update)},[]); return <><a href="#main" className="skip-link">Skip to content</a><Header path={path}/>{path==='/'?<Home/>:path==='/find'?<Suspense fallback={<main id="main" className="loading-page" role="status">Loading the map…</main>}><Find/></Suspense>:path==='/resources'?<Resources/>:path==='/about'?<About/>:import.meta.env.DEV && path==='/design-system'?<DesignPreview/>:path.startsWith('/resources/')?<Article slug={path.slice('/resources/'.length)}/>:<NotFound/>}</>; }
export default App;
