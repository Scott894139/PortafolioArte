import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const NotFoundCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ErrorCode = styled(motion.h1)`
  font-size: 8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 600px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const SearchSection = styled.div`
  background: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const QuickLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ArtworkIllustration = styled(motion.div)`
  font-size: 3rem;
  margin-bottom: 2rem;
  opacity: 0.5;
`;

const NotFound = () => {
  const quickLinks = [
    { to: '/', label: 'Inicio', icon: '🏠' },
    { to: '/galeria', label: 'Galería', icon: '🎨' },
    { to: '/proyectos', label: 'Proyectos', icon: '💼' },
    { to: '/tienda', label: 'Tienda', icon: '🛍️' },
    { to: '/blog', label: 'Blog', icon: '📝' },
    { to: '/contacto', label: 'Contacto', icon: '📧' }
  ];

  return (
    <NotFoundContainer>
      <Helmet>
        <title>Página No Encontrada - Artista Digital</title>
        <meta name="description" content="Lo sentimos, la página que buscas no existe." />
      </Helmet>

      <Container>
        <NotFoundCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArtworkIllustration
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            🎨
          </ArtworkIllustration>
          
          <ErrorCode
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            404
          </ErrorCode>
          
          <ErrorTitle>¡Oops! Página no encontrada</ErrorTitle>
          <ErrorMessage>
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Puede que el enlace esté roto o que hayas escrito mal la URL.
          </ErrorMessage>

          <ActionButtons>
            <ActionButton
              as={Link}
              to="/"
              primary
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHome />
              Ir al inicio
            </ActionButton>
            
            <ActionButton
              href="javascript:history.back()"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft />
              Volver atrás
            </ActionButton>
          </ActionButtons>

          <SearchSection>
            <SearchTitle>¿Buscas algo específico?</SearchTitle>
            <SearchInput 
              type="text" 
              placeholder="Buscar en el sitio..." 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Implementar búsqueda
                  console.log('Buscar:', e.target.value);
                }
              }}
            />
          </SearchSection>

          <div>
            <h4>Enlaces rápidos:</h4>
            <QuickLinks>
              {quickLinks.map((link, index) => (
                <QuickLink key={index} to={link.to}>
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {link.icon}
                  </span>
                  {link.label}
                </QuickLink>
              ))}
            </QuickLinks>
          </div>
        </NotFoundCard>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFound; 