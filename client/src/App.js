import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';

// Páginas
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import GalleryDetail from './pages/GalleryDetail';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Store from './pages/Store';
import StoreDetail from './pages/StoreDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';

// Context
import { CartProvider } from './context/CartContext';
import { LoadingProvider } from './context/LoadingContext';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <LoadingProvider>
          <CartProvider>
            <Router>
              <GlobalStyle />
              <ScrollToTop />
              <div className="App">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/galeria" element={<Gallery />} />
                    <Route path="/galeria/:id" element={<GalleryDetail />} />
                    <Route path="/sobre-mi" element={<About />} />
                    <Route path="/proyectos" element={<Projects />} />
                    <Route path="/proyectos/:id" element={<ProjectDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/tienda" element={<Store />} />
                    <Route path="/tienda/:id" element={<StoreDetail />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/carrito" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orden-exitosa" element={<OrderSuccess />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <LoadingSpinner />
              </div>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </Router>
          </CartProvider>
        </LoadingProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App; 