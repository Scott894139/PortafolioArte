import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiCalendar, FiTag, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProjectDetailContainer = styled.div`
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

const ProjectHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray};
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProcessSection = styled.section`
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProcessStep = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setTimeout(() => {
          setProject({
            id: id,
            title: 'Proyecto Fantasía Épica',
            description: 'Una serie completa de ilustraciones para un videojuego de fantasía medieval, incluyendo diseño de personajes, escenarios y elementos de interfaz.',
            images: [
              '/api/placeholder/400/300',
              '/api/placeholder/400/300',
              '/api/placeholder/400/300',
              '/api/placeholder/400/300'
            ],
            category: 'ilustracion',
            date: '2024',
            tags: ['fantasía', 'videojuego', 'personajes', 'escenarios'],
            tools: ['Photoshop', 'Procreate', 'Blender'],
            duration: '3 meses',
            client: 'Indie Game Studio'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading project:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <ProjectDetailContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando proyecto...</p>
          </div>
        </Container>
      </ProjectDetailContainer>
    );
  }

  if (!project) {
    return (
      <ProjectDetailContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Proyecto no encontrado</p>
          </div>
        </Container>
      </ProjectDetailContainer>
    );
  }

  const processSteps = [
    { number: 1, title: 'Investigación', description: 'Análisis del brief y referencias visuales' },
    { number: 2, title: 'Bocetos', description: 'Sketches iniciales y exploración de ideas' },
    { number: 3, title: 'Desarrollo', description: 'Creación de las ilustraciones finales' },
    { number: 4, title: 'Refinamiento', description: 'Ajustes y detalles finales' }
  ];

  return (
    <ProjectDetailContainer>
      <Helmet>
        <title>{project.title} - Proyectos</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <Container>
        <BackButton
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/proyectos')}
        >
          <FiArrowLeft />
          Volver a proyectos
        </BackButton>

        <ProjectHeader>
          <Title>{project.title}</Title>
          <Description>{project.description}</Description>
          <ProjectMeta>
            <MetaItem>
              <FiCalendar />
              {project.date}
            </MetaItem>
            <MetaItem>
              <FiTag />
              {project.tags.join(', ')}
            </MetaItem>
            <MetaItem>
              <FiExternalLink />
              {project.client}
            </MetaItem>
          </ProjectMeta>
        </ProjectHeader>

        <ImageGallery>
          {project.images.map((image, index) => (
            <ImageWrapper key={index}>
              <img src={image} alt={`${project.title} ${index + 1}`} />
            </ImageWrapper>
          ))}
        </ImageGallery>

        <ProcessSection>
          <SectionTitle>Proceso Creativo</SectionTitle>
          <ProcessSteps>
            {processSteps.map((step, index) => (
              <ProcessStep key={index}>
                <StepNumber>{step.number}</StepNumber>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </ProcessStep>
            ))}
          </ProcessSteps>
        </ProcessSection>
      </Container>
    </ProjectDetailContainer>
  );
};

export default ProjectDetail; 