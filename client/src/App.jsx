
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/admin/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

import { Toaster } from 'react-hot-toast';
import FloatingActions from './components/FloatingActions';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductsPage from './pages/Products';
import SubcategoryPage from './pages/SubcategoryPage';
import ProductDetails from './pages/ProductDetails';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetails from './pages/CaseStudyDetails';
import ProjectsPublic from './pages/Projects';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Projects from './pages/admin/Projects';
import Enquiries from './pages/admin/Enquiries';


// Layout wrapper to conditionally show Nav/Footer and handle Transitions
const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Toaster position="top-right" />
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "h-screen overflow-hidden" : "flex-grow"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={
              <PageTransition>
                <Home />
              </PageTransition>
            } />
            <Route path="/about" element={
              <PageTransition>
                <About />
              </PageTransition>
            } />
            <Route path="/contact" element={
              <PageTransition>
                <Contact />
              </PageTransition>
            } />

            {/* Products hierarchy:
                /products              → Main category (Conveyors) — shows all 11 subcategory cards
                /products/:subcategory → Subcategory page — shows products in that conveyor type
                /product/:slug         → Individual product detail page
            */}
            <Route path="/products" element={
              <PageTransition>
                <ProductsPage />
              </PageTransition>
            } />
            <Route path="/products/:subcategory" element={
              <PageTransition>
                <SubcategoryPage />
              </PageTransition>
            } />
            <Route path="/product/:slug" element={
              <PageTransition>
                <ProductDetails />
              </PageTransition>
            } />

            {/* Legacy slug route — redirect-compatible */}
            <Route path="/products/detail/:slug" element={
              <PageTransition>
                <ProductDetails />
              </PageTransition>
            } />

            <Route path="/services" element={
              <PageTransition>
                <Services />
              </PageTransition>
            } />
            <Route path="/projects" element={
              <PageTransition>
                <ProjectsPublic />
              </PageTransition>
            } />
            <Route path="/case-studies" element={
              <PageTransition>
                <CaseStudies />
              </PageTransition>
            } />
            <Route path="/projects/:slug" element={
              <PageTransition>
                <CaseStudyDetails />
              </PageTransition>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <PageTransition>
                <Login />
              </PageTransition>
            } />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/projects" element={<Projects />} />
              <Route path="/admin/enquiries" element={<Enquiries />} />
            </Route>


          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingActions />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LayoutWrapper />
      </AuthProvider>
    </Router>
  );
}

export default App;
