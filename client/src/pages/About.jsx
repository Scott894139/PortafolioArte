import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 12px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SkillsSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const SkillCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SkillIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
`;

const SkillTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const SkillDescription = styled.p`
  color: ${props => props.theme.colors.gray};
  font-size: 0.95rem;
  line-height: 1.5;
`;

const About = () => {
  const skills = [
    {
      title: 'Ilustración Digital',
      description: 'Creación de ilustraciones originales usando herramientas digitales avanzadas.',
      icon: '🎨'
    },
    {
      title: 'Diseño Gráfico',
      description: 'Desarrollo de identidades visuales, logotipos y materiales promocionales.',
      icon: '📐'
    },
    {
      title: 'Arte Conceptual',
      description: 'Diseño de personajes, escenarios y conceptos para videojuegos y animación.',
      icon: '💭'
    },
    {
      title: 'Retratos',
      description: 'Especialización en retratos digitales realistas y estilizados.',
      icon: '👤'
    }
  ];

  return (
    <AboutContainer>
      <Helmet>
        <title>Sobre Mí - Artista Digital</title>
        <meta name="description" content="Conoce más sobre mí, mi trabajo y mi pasión por el arte digital." />
      </Helmet>

      <Container>
        <Hero>
          <ImageWrapper>
            <img src="/api/placeholder/400/400" alt="Artista Digital" />
          </ImageWrapper>
          
          <Content>
            <Title>Hola, soy Aline</Title>
            <Subtitle>Artista Digital & Ilustradora</Subtitle>
            <Description>
              Soy una artista digital apasionada por crear mundos visuales únicos y expresivos. 
              Con más de 5 años de experiencia en el campo del arte digital, me especializo en 
              ilustraciones, retratos y diseño conceptual.
            </Description>
            <Description>
              Mi trabajo se caracteriza por combinar técnicas tradicionales con herramientas 
              digitales modernas, creando piezas que conectan emocionalmente con el espectador.
            </Description>
            
            <SocialLinks>
              <SocialLink
                href="mailto:contact@example.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiMail />
              </SocialLink>
              <SocialLink
                href="https://instagram.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInstagram />
              </SocialLink>
              <SocialLink
                href="https://twitter.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter />
              </SocialLink>
              <SocialLink
                href="https://linkedin.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiLinkedin />
              </SocialLink>
            </SocialLinks>
          </Content>
        </Hero>

        <SkillsSection>
          <SectionTitle>Mis Especialidades</SectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCard
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <SkillIcon>{skill.icon}</SkillIcon>
                <SkillTitle>{skill.title}</SkillTitle>
                <SkillDescription>{skill.description}</SkillDescription>
              </SkillCard>
            ))}
          </SkillsGrid>
        </SkillsSection>
      </Container>
    </AboutContainer>
  );
};

export default About; 