import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiGrid, FiList, FiSearch, FiEye, FiHeart } from 'react-icons/fi';
import { galleryService } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';
import demoWorks from '../data/demoWorks';

const GalleryContainer = styled.div`
  padding: 6rem 0 4rem;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.wide};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const GalleryTitle = styled.h1`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const GalleryDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ view }) => 
    view === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'};
  gap: 2rem;
  margin-bottom: 3rem;
`;

const GalleryItem = styled(motion.div)`
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

const ItemImage = styled.div`
  width: 100%;
  height: ${({ view }) => view === 'grid' ? '250px' : '200px'};
  background: url(${({ src }) => src}) center/cover;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  position: relative;
  cursor: pointer;
`;

const ItemOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  ${ItemImage}:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: white;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ItemContent = styled.div`
  padding: 1.5rem;
  display: ${({ view }) => view === 'list' ? 'flex' : 'block'};
  align-items: ${({ view }) => view === 'list' ? 'center' : 'stretch'};
  gap: ${({ view }) => view === 'list' ? '1rem' : '0'};
`;

const ItemTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const ItemDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1rem;
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ItemCategory = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Gallery = () => {
  const [works, setWorks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    featured: ''
  });
  const [view, setView] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchWorks(true);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      // Usar categorías de demostración
      const data = ['ilustracion-digital', 'arte-conceptual', 'oleo', 'grafito'];
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchWorks = async (reset = false) => {
    try {
      showLoading('Cargando obras...');
      // Usar demoWorks importado
      let filteredWorks = demoWorks;
      
      if (filters.category) {
        filteredWorks = filteredWorks.filter(work => work.category === filters.category);
      }
      
      if (filters.featured) {
        filteredWorks = filteredWorks.filter(work => work.featured === (filters.featured === 'true'));
      }
      
      if (filters.search) {
        filteredWorks = filteredWorks.filter(work => 
          work.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          work.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      const data = {
        items: filteredWorks,
        currentPage: 1,
        totalPages: 1
      };
      
      if (reset) {
        setWorks(data.items || []);
        setCurrentPage(1);
      } else {
        setWorks(prev => [...prev, ...(data.items || [])]);
      }
      
      setHasMore(false); // Para demo, no hay más páginas
    } catch (error) {
      console.error('Error fetching works:', error);
      toast.error('Error cargando obras');
    } finally {
      hideLoading();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    fetchWorks(false);
  };

  const categoryLabels = {
    'ilustracion-digital': 'Ilustración Digital',
    'arte-conceptual': 'Arte Conceptual',
    'oleo': 'Óleo',
    'grafito': 'Grafito',
    'otros': 'Otros'
  };

  return (
    <>
      <Helmet>
        <title>Galería - Artista Digital</title>
        <meta name="description" content="Explora mi galería de arte digital, ilustraciones y diseños únicos." />
      </Helmet>

      <GalleryContainer>
        <Container>
          <GalleryHeader>
            <GalleryTitle>Galería de Obras</GalleryTitle>
            <GalleryDescription>
              Descubre mi colección de arte digital, desde ilustraciones conceptuales 
              hasta diseños gráficos innovadores.
            </GalleryDescription>
          </GalleryHeader>

          <FilterSection>
            <FilterGroup>
              <FilterLabel>Categoría:</FilterLabel>
              <FilterSelect 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Destacadas:</FilterLabel>
              <FilterSelect 
                value={filters.featured} 
                onChange={(e) => handleFilterChange('featured', e.target.value)}
              >
                <option value="">Todas</option>
                <option value="true">Solo destacadas</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FiSearch />
              <SearchInput 
                placeholder="Buscar obras..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>

            <ViewToggle>
              <ViewButton 
                active={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <FiGrid />
              </ViewButton>
              <ViewButton 
                active={view === 'list'}
                onClick={() => setView('list')}
              >
                <FiList />
              </ViewButton>
            </ViewToggle>
          </FilterSection>

          <GalleryGrid view={view}>
            <AnimatePresence>
              {works.map((work, index) => (
                <GalleryItem
                  key={work._id}
                  view={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ItemImage src={work.image} view={view}>
                    <ItemOverlay>
                      <OverlayButton as={Link} to={`/galeria/${work._id}`}>
                        <FiEye />
                      </OverlayButton>
                      <OverlayButton>
                        <FiHeart />
                      </OverlayButton>
                    </ItemOverlay>
                  </ItemImage>
                  
                  <ItemContent view={view}>
                    <div style={{ flex: 1 }}>
                      <ItemTitle>{work.title}</ItemTitle>
                      <ItemDescription>{work.description}</ItemDescription>
                      <ItemMeta>
                        <ItemCategory>
                          {categoryLabels[work.category] || work.category}
                        </ItemCategory>
                        <span>{work.year}</span>
                      </ItemMeta>
                    </div>
                  </ItemContent>
                </GalleryItem>
              ))}
            </AnimatePresence>
          </GalleryGrid>

          {hasMore && (
            <LoadMoreButton onClick={handleLoadMore}>
              Cargar más obras
            </LoadMoreButton>
          )}
        </Container>
      </GalleryContainer>
    </>
  );
};

export default Gallery; 