import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PageTransition } from './components/PageTransition';
import { SearchButton } from './components/SearchButton';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Psychologie = React.lazy(() => import('./pages/Psychologie').then(module => ({ default: module.Psychologie })));
const Graphotherapie = React.lazy(() => import('./pages/Graphotherapie').then(module => ({ default: module.Graphotherapie })));
const GraphotherapieExercices = React.lazy(() => import('./pages/GraphotherapieExercices').then(module => ({ default: module.GraphotherapieExercices })));
const Collaboration = React.lazy(() => import('./pages/Collaboration').then(module => ({ default: module.Collaboration })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const MentionsLegales = React.lazy(() => import('./pages/MentionsLegales').then(module => ({ default: module.MentionsLegales })));
const TCCDetails = React.lazy(() => import('./pages/TCCDetails').then(module => ({ default: module.TCCDetails })));
const RITMODetails = React.lazy(() => import('./pages/RITMODetails').then(module => ({ default: module.RITMODetails })));
const HypnoseDetails = React.lazy(() => import('./pages/HypnoseDetails').then(module => ({ default: module.HypnoseDetails })));
const QuelleApprocheDetails = React.lazy(() => import('./pages/QuelleApprocheDetails').then(module => ({ default: module.QuelleApprocheDetails })));
const Blog = React.lazy(() => import('./pages/Blog').then(module => ({ default: module.Blog })));
const BlogAdmin = React.lazy(() => import('./pages/BlogAdmin').then(module => ({ default: module.BlogAdmin })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const DomainesIntervention = React.lazy(() => import('./pages/DomainesIntervention').then(module => ({ default: module.DomainesIntervention })));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword').then(module => ({ default: module.ResetPassword })));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-nature-50">
          <Header />
          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/psychologie" element={<Psychologie />} />
                <Route path="/graphotherapie" element={<Graphotherapie />} />
                <Route path="/graphotherapie/exercices" element={<GraphotherapieExercices />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/psychologie/tcc" element={<TCCDetails />} />
                <Route path="/psychologie/ritmo" element={<RITMODetails />} />
                <Route path="/psychologie/hypnose" element={<HypnoseDetails />} />
                <Route path="/psychologie/quelle-approche" element={<QuelleApprocheDetails />} />
                <Route path="/psychologie/domaines-intervention" element={<DomainesIntervention />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/admin/blog" element={<BlogAdmin />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </PageTransition>
          </Suspense>
          <SearchButton />
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;