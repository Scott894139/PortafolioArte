import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.fixed};
  background: ${({ isScrolled }) => 
    isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.standard};
  border-bottom: ${({ isScrolled }) => 
    isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  max-width: ${({ theme }) => theme.breakpoints.wide};
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-left: ${({ theme }) => theme.spacing.sm};
    padding-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: 20px;
  text-align: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileMenuContent = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 280px;
  background: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-bottom: 1rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/galeria', label: 'Galería' },
    { path: '/sobre-mi', label: 'Sobre Mí' },
    { path: '/proyectos', label: 'Proyectos' },
    { path: '/blog', label: 'Blog' },
    { path: '/tienda', label: 'Tienda' },
    { path: '/contacto', label: 'Contacto' }
  ];

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <Nav>
        <Logo to="/">Artista Digital</Logo>
        
        <NavLinks>
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        
        <RightSection>
          <CartButton as={Link} to="/carrito">
            <FiShoppingCart />
            {getCartItemsCount() > 0 && (
              <CartBadge>{getCartItemsCount()}</CartBadge>
            )}
          </CartButton>
          
          <MobileMenuButton onClick={handleMobileMenuToggle}>
            <FiMenu />
          </MobileMenuButton>
        </RightSection>
      </Nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          >
            <MobileMenuContent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileMenuHeader>
                <Logo to="/" onClick={closeMobileMenu}>
                  Artista Digital
                </Logo>
                <button onClick={closeMobileMenu}>
                  <FiX />
                </button>
              </MobileMenuHeader>
              
              <MobileNavLinks>
                {navItems.map((item) => (
                  <MobileNavLink 
                    key={item.path}
                    to={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}
              </MobileNavLinks>
            </MobileMenuContent>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header; 