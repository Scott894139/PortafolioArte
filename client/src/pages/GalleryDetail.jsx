import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiDownload, FiHeart, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import demoWorks from '../data/demoWorks';

const GalleryDetailContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 500px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  span {
    color: ${props => props.theme.colors.gray};
    font-size: 0.9rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.colors.primary};
  background: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const GalleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);

  useEffect(() => {
    const found = demoWorks.find(work => work._id === id);
    setArtwork(found);
  }, [id]);

  if (!artwork) {
    return (
      <GalleryDetailContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Obra no encontrada</p>
          </div>
        </Container>
      </GalleryDetailContainer>
    );
  }

  return (
    <GalleryDetailContainer>
      <Helmet>
        <title>{artwork.title} - Galería</title>
        <meta name="description" content={artwork.description} />
      </Helmet>

      <Container>
        <BackButton
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/galeria')}
        >
          <FiArrowLeft />
          Volver a la galería
        </BackButton>

        <ImageContainer>
          <ImageWrapper>
            <img src={artwork.image} alt={artwork.title} />
          </ImageWrapper>

          <InfoPanel>
            <Title>{artwork.title}</Title>
            <Description>{artwork.description}</Description>
            
            <MetaInfo>
              <span><strong>Categoría:</strong> {artwork.category}</span>
              <span><strong>Técnica:</strong> {artwork.technique}</span>
              <span><strong>Año:</strong> {artwork.year}</span>
              <span><strong>Dimensiones:</strong> {artwork.dimensions}</span>
            </MetaInfo>

            <ActionButtons>
              <ActionButton
                primary
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHeart />
                Me gusta
              </ActionButton>
              
              <ActionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiShare2 />
                Compartir
              </ActionButton>
              
              <ActionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload />
                Descargar
              </ActionButton>
            </ActionButtons>
          </InfoPanel>
        </ImageContainer>
      </Container>
    </GalleryDetailContainer>
  );
};

export default GalleryDetail; 