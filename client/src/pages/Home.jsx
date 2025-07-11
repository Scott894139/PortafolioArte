import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { galleryService, projectService, testimonialService } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}dd, ${({ theme }) => theme.colors.secondary}dd),
              url('/images/hero-bg.jpg') center/cover;
  color: white;
  text-align: center;
  padding: 6rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 4rem 0;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${({ variant }) => variant === 'primary' ? '#fff' : 'transparent'};
  color: ${({ variant }) => variant === 'primary' ? '#2C3E50' : '#fff'};
  border: 2px solid ${({ variant }) => variant === 'primary' ? '#fff' : '#fff'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background: ${({ variant }) => variant === 'primary' ? 'rgba(255, 255, 255, 0.1)' : '#fff'};
    color: ${({ variant }) => variant === 'primary' ? '#fff' : '#2C3E50'};
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  padding: 4rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 0;
  }
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.wide};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.md};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.colors.shadow.lg};
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 250px;
  background: url(${({ src }) => src}) center/cover;
  background-color: ${({ theme }) => theme.colors.gray[200]};
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-decoration: none;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.standard};
  margin: 0 auto;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const TestimonialCard = styled(Card)`
  text-align: center;
  padding: 2rem;
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Home = () => {
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoading('Cargando contenido...');
        
        // Usar datos de demostración en lugar de llamadas API
        // que pueden fallar si el backend no está corriendo
        const worksData = {
          items: [
            {
              _id: '1',
              title: 'Ilustración Digital',
              description: 'Arte digital conceptual',
              image: '/images/galeria/ilustracion1.jpeg'
            },
            {
              _id: '2',
              title: 'Retrato Artístico',
              description: 'Retrato digital personalizado',
              image: '/images/galeria/retrato1.jpeg'
            },
            {
              _id: '3',
              title: 'Diseño Gráfico',
              description: 'Diseño moderno y creativo',
              image: '/images/galeria/ilustracion2.jpeg'
            }
          ]
        };

        const projectsData = {
          projects: [
            {
              _id: '1',
              title: 'Proyecto Especial',
              description: 'Desarrollo de identidad visual completa',
              mainImage: '/images/projects/project1.jpg'
            },
            {
              _id: '2',
              title: 'Campaña Digital',
              description: 'Creación de contenido visual para redes sociales',
              mainImage: '/images/projects/project2.jpg'
            }
          ]
        };

        const testimonialsData = {
          testimonials: [
            {
              _id: '1',
              content: 'Excelente trabajo, muy profesional y creativo.',
              name: 'María González',
              company: 'Empresa ABC'
            },
            {
              _id: '2',
              content: 'Superó todas mis expectativas, altamente recomendado.',
              name: 'Carlos Rodríguez',
              company: 'StartUp XYZ'
            }
          ]
        };

        setFeaturedWorks(worksData.items || []);
        setFeaturedProjects(projectsData.projects || []);
        setTestimonials(testimonialsData.testimonials || []);
      } catch (error) {
        console.error('Error loading home data:', error);
        toast.error('Error cargando contenido');
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, []); // Sin dependencias para evitar bucles infinitos

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success('Agregado al carrito');
  };

  return (
    <>
      <Helmet>
        <title>Inicio - Artista Digital</title>
        <meta name="description" content="Portafolio de artista digital especializado en arte conceptual, ilustración digital y diseño gráfico." />
      </Helmet>

      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Creando Arte Digital Único</HeroTitle>
          <HeroSubtitle>
            Transformo ideas en obras visuales impactantes que conectan con las emociones
          </HeroSubtitle>
          <HeroButtons>
            <CTAButton to="/galeria" variant="primary">
              Ver Galería <FiArrowRight />
            </CTAButton>
            <CTAButton to="/contacto" variant="secondary">
              Contactar
            </CTAButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Obras Destacadas</SectionTitle>
          <Grid>
            {featuredWorks.map((work, index) => (
              <Card
                key={work._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardImage src={work.image} />
                <CardContent>
                  <CardTitle>{work.title}</CardTitle>
                  <CardDescription>{work.description}</CardDescription>
                  <CardActions>
                    <ActionButton as={Link} to={`/galeria/${work._id}`}>
                      <FiEye />
                    </ActionButton>
                    <ActionButton>
                      <FiHeart />
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <div style={{ textAlign: 'center' }}>
            <ViewAllButton to="/galeria">
              Ver toda la galería <FiArrowRight />
            </ViewAllButton>
          </div>
        </Container>
      </Section>

      <Section style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <SectionTitle>Proyectos Especiales</SectionTitle>
          <Grid>
            {featuredProjects.map((project, index) => (
              <Card
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardImage src={project.mainImage} />
                <CardContent>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                  <CardActions>
                    <ActionButton as={Link} to={`/proyectos/${project._id}`}>
                      <FiEye />
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <div style={{ textAlign: 'center' }}>
            <ViewAllButton to="/proyectos">
              Ver todos los proyectos <FiArrowRight />
            </ViewAllButton>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Lo que dicen mis clientes</SectionTitle>
          <Grid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialText>"{testimonial.content}"</TestimonialText>
                <TestimonialAuthor>
                  {testimonial.name}
                  {testimonial.company && ` - ${testimonial.company}`}
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
};

export default Home; 