import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiCalendar, FiUser, FiShare2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BlogPostContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 800px;
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

const PostHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray};
`;

const FeaturedImage = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PostContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text};
    margin: 2rem 0 1rem 0;
  }
  
  h3 {
    font-size: 1.4rem;
    color: ${props => props.theme.colors.text};
    margin: 1.5rem 0 1rem 0;
  }
  
  p {
    color: ${props => props.theme.colors.gray};
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
    
    li {
      color: ${props => props.theme.colors.gray};
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.primary};
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: ${props => props.theme.colors.gray};
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
`;

const ShareButton = styled(motion.button)`
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

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setTimeout(() => {
          setPost({
            id: 1,
            title: 'Técnicas de Ilustración Digital: De Principiante a Experto',
            content: `
              <h2>Introducción</h2>
              <p>La ilustración digital ha revolucionado la forma en que creamos arte. Con las herramientas adecuadas y técnicas apropiadas, cualquier persona puede crear obras impresionantes.</p>
              
              <h2>Herramientas Básicas</h2>
              <p>Para comenzar en la ilustración digital, necesitarás:</p>
              <ul>
                <li>Una tableta gráfica o tablet con lápiz óptico</li>
                <li>Software de dibujo (Photoshop, Procreate, Clip Studio Paint)</li>
                <li>Conocimientos básicos de composición y color</li>
              </ul>
              
              <h2>Técnicas Fundamentales</h2>
              <p>Las técnicas más importantes incluyen:</p>
              
              <h3>1. Construcción de Formas</h3>
              <p>Todo objeto complejo puede descomponerse en formas simples. Aprende a ver las formas básicas en todo lo que dibujas.</p>
              
              <h3>2. Manejo de Luz y Sombra</h3>
              <p>La iluminación es crucial para dar volumen y realismo a tus ilustraciones. Practica con diferentes fuentes de luz.</p>
              
              <h3>3. Uso del Color</h3>
              <p>El color puede cambiar completamente el sentimiento de una ilustración. Aprende teoría del color y cómo aplicarla.</p>
              
              <blockquote>
                "La práctica constante es la clave del éxito en la ilustración digital. No tengas miedo de experimentar."
              </blockquote>
              
              <h2>Conclusión</h2>
              <p>La ilustración digital es un campo en constante evolución. Lo más importante es mantener la curiosidad y seguir aprendiendo nuevas técnicas.</p>
            `,
            image: '/api/placeholder/800/400',
            author: 'Aline',
            date: '2024-01-15',
            slug: slug
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <BlogPostContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando artículo...</p>
          </div>
        </Container>
      </BlogPostContainer>
    );
  }

  if (!post) {
    return (
      <BlogPostContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Artículo no encontrado</p>
          </div>
        </Container>
      </BlogPostContainer>
    );
  }

  return (
    <BlogPostContainer>
      <Helmet>
        <title>{post.title} - Blog</title>
        <meta name="description" content={`Artículo sobre ${post.title}`} />
      </Helmet>

      <Container>
        <BackButton
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/blog')}
        >
          <FiArrowLeft />
          Volver al blog
        </BackButton>

        <PostHeader>
          <Title>{post.title}</Title>
          <PostMeta>
            <MetaItem>
              <FiUser />
              {post.author}
            </MetaItem>
            <MetaItem>
              <FiCalendar />
              {new Date(post.date).toLocaleDateString()}
            </MetaItem>
          </PostMeta>
        </PostHeader>

        <FeaturedImage>
          <img src={post.image} alt={post.title} />
        </FeaturedImage>

        <PostContent>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <ShareButtons>
            <ShareButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShare2 />
              Compartir
            </ShareButton>
          </ShareButtons>
        </PostContent>
      </Container>
    </BlogPostContainer>
  );
};

export default BlogPost; 