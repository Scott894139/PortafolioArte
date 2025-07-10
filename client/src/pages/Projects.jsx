import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiCalendar, FiTag } from 'react-icons/fi';

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray};
  max-width: 600px;
  margin: 0 auto;
`;

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.colors.primary};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.primary};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 250px;
  background-color: ${props => props.theme.colors.lightGray};
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'ilustracion', label: 'Ilustración' },
    { id: 'diseno', label: 'Diseño' },
    { id: 'arte-conceptual', label: 'Arte Conceptual' },
    { id: 'retratos', label: 'Retratos' }
  ];

  useEffect(() => {
    // Simulación de carga de proyectos
    const fetchProjects = async () => {
      try {
        setTimeout(() => {
          const mockProjects = [
            {
              id: 1,
              title: 'Proyecto Fantasía Épica',
              description: 'Una serie de ilustraciones para un videojuego de fantasía medieval.',
              image: '/api/placeholder/400/300',
              category: 'ilustracion',
              date: '2024',
              tags: ['fantasía', 'videojuego', 'personajes']
            },
            {
              id: 2,
              title: 'Identidad Visual Corporativa',
              description: 'Desarrollo completo de identidad visual para startup tecnológica.',
              image: '/api/placeholder/400/300',
              category: 'diseno',
              date: '2024',
              tags: ['branding', 'logotipo', 'corporativo']
            },
            {
              id: 3,
              title: 'Retratos Digitales',
              description: 'Colección de retratos realizados con técnicas digitales avanzadas.',
              image: '/api/placeholder/400/300',
              category: 'retratos',
              date: '2023',
              tags: ['retrato', 'digital', 'realismo']
            },
            {
              id: 4,
              title: 'Concept Art para Animación',
              description: 'Diseños conceptuales para serie animada independiente.',
              image: '/api/placeholder/400/300',
              category: 'arte-conceptual',
              date: '2023',
              tags: ['animación', 'concept art', 'escenarios']
            }
          ];
          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === 'todos') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === filterId));
    }
  };

  if (loading) {
    return (
      <ProjectsContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando proyectos...</p>
          </div>
        </Container>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <Helmet>
        <title>Proyectos - Artista Digital</title>
        <meta name="description" content="Explora mi portafolio de proyectos de arte digital, ilustración y diseño." />
      </Helmet>

      <Container>
        <Header>
          <Title>Mis Proyectos</Title>
          <Subtitle>
            Una colección de mis trabajos más destacados en arte digital, 
            ilustración y diseño creativo.
          </Subtitle>
        </Header>

        <FilterButtons>
          {filters.map(filter => (
            <FilterButton
              key={filter.id}
              active={activeFilter === filter.id}
              onClick={() => handleFilterChange(filter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterButtons>

        <ProjectsGrid>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectImage>
                <img src={project.image} alt={project.title} />
                <ProjectOverlay>
                  <Link to={`/proyectos/${project.id}`}>
                    <ViewButton>
                      <FiEye />
                      Ver Proyecto
                    </ViewButton>
                  </Link>
                </ProjectOverlay>
              </ProjectImage>
              
              <ProjectInfo>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectMeta>
                  <MetaItem>
                    <FiCalendar />
                    {project.date}
                  </MetaItem>
                  <MetaItem>
                    <FiTag />
                    {project.tags.join(', ')}
                  </MetaItem>
                </ProjectMeta>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Container>
    </ProjectsContainer>
  );
};

export default Projects; 