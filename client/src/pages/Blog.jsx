import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const BlogContainer = styled.div`
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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const BlogCard = styled(motion.article)`
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

const BlogImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.lightGray};
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

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReadMore = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(() => {
          const mockPosts = [
            {
              id: 1,
              title: 'Técnicas de Ilustración Digital: De Principiante a Experto',
              excerpt: 'Descubre las mejores técnicas y herramientas para crear ilustraciones digitales impresionantes.',
              image: '/api/placeholder/400/200',
              author: 'Aline',
              date: '2024-01-15',
              slug: 'tecnicas-ilustracion-digital'
            },
            {
              id: 2,
              title: 'El Arte del Color: Teoría y Práctica',
              excerpt: 'Aprende cómo el color puede transformar completamente tus obras de arte.',
              image: '/api/placeholder/400/200',
              author: 'Aline',
              date: '2024-01-10',
              slug: 'arte-del-color'
            },
            {
              id: 3,
              title: 'Inspiración Diaria: Cómo Mantener la Creatividad',
              excerpt: 'Consejos prácticos para mantener tu creatividad activa todos los días.',
              image: '/api/placeholder/400/200',
              author: 'Aline',
              date: '2024-01-05',
              slug: 'inspiracion-diaria'
            },
            {
              id: 4,
              title: 'Herramientas Esenciales para Artistas Digitales',
              excerpt: 'Una guía completa sobre las mejores herramientas para arte digital.',
              image: '/api/placeholder/400/200',
              author: 'Aline',
              date: '2024-01-01',
              slug: 'herramientas-esenciales'
            }
          ];
          setPosts(mockPosts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <BlogContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando artículos...</p>
          </div>
        </Container>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <Helmet>
        <title>Blog - Artista Digital</title>
        <meta name="description" content="Artículos sobre arte digital, técnicas de ilustración y inspiración creativa." />
      </Helmet>

      <Container>
        <Header>
          <Title>Blog</Title>
          <Subtitle>
            Artículos sobre arte digital, técnicas de ilustración y mi proceso creativo.
          </Subtitle>
        </Header>

        <BlogGrid>
          {posts.map(post => (
            <BlogCard
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BlogImage>
                <img src={post.image} alt={post.title} />
              </BlogImage>
              
              <BlogContent>
                <BlogTitle>{post.title}</BlogTitle>
                <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                <BlogMeta>
                  <MetaItem>
                    <FiUser />
                    {post.author}
                  </MetaItem>
                  <MetaItem>
                    <FiCalendar />
                    {new Date(post.date).toLocaleDateString()}
                  </MetaItem>
                </BlogMeta>
                <ReadMore to={`/blog/${post.slug}`}>
                  Leer más
                  <FiArrowRight />
                </ReadMore>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>
      </Container>
    </BlogContainer>
  );
};

export default Blog; 