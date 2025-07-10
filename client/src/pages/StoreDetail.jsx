import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2, FiZoomIn } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const DetailContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  margin-bottom: 2rem;
  font-weight: 500;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled(motion.div)`
  width: 100%;
  height: 500px;
  background: ${props => props.theme.colors.lightGray};
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  cursor: zoom-in;
  
  @media (max-width: 768px) {
    height: 400px;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ImageAction = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: white;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const ProductDescription = styled.div`
  color: ${props => props.theme.colors.gray};
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ProductFeatures = styled.div`
  background: ${props => props.theme.colors.lightGray};
  padding: 1.5rem;
  border-radius: 8px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  strong {
    color: ${props => props.theme.colors.text};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
  
  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background: ${props => props.theme.colors.primary};
      color: white;
    }
  }
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ShareButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.lightGray};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const RelatedProducts = styled.div`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const RelatedCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RelatedImage = styled.div`
  width: 100%;
  height: 150px;
  background: ${props => props.theme.colors.lightGray};
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const RelatedInfo = styled.div`
  padding: 1rem;
`;

const RelatedTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const RelatedPrice = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      showLoading('Cargando producto...');
      
      // Para demo, usar producto de ejemplo directamente
      // En el futuro se puede reactivar: const response = await api.get(`/store/${id}`);
      setProduct({
        _id: id,
        name: 'Ilustración Digital Personalizada',
        description: 'Retrato digital personalizado creado específicamente para ti. Perfecto para regalos únicos o para decorar tu espacio personal. Incluye múltiples revisiones hasta que estés completamente satisfecho con el resultado.',
        price: 75,
        category: 'ilustraciones',
        image: '/images/product1.jpg',
        features: [
          { label: 'Formato', value: 'Digital (JPG/PNG)' },
          { label: 'Resolución', value: '300 DPI' },
          { label: 'Tamaño', value: '3000x4000 px' },
          { label: 'Revisiones', value: 'Hasta 3 revisiones' },
          { label: 'Tiempo de entrega', value: '5-7 días laborales' }
        ]
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      hideLoading();
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await api.get('/store');
      const filtered = response.data.filter(p => p._id !== id).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Para demo, usar productos de ejemplo
      setRelatedProducts([
        {
          _id: '2',
          name: 'Diseño de Logo',
          price: 150,
          image: '/images/product2.jpg'
        },
        {
          _id: '3',
          name: 'Poster Artístico',
          price: 25,
          image: '/images/product3.jpg'
        }
      ]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      toast.success('Producto agregado al carrito');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <DetailContainer>
      <Helmet>
        <title>{product.name} - Tienda</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Container>
        <BackButton to="/tienda">
          <FiArrowLeft />
          Volver a la tienda
        </BackButton>

        <ProductLayout>
          <ImageSection>
            <MainImage
              image={product.image}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ImageOverlay>
                <ImageAction>
                  <FiZoomIn />
                </ImageAction>
              </ImageOverlay>
            </MainImage>
          </ImageSection>

          <ProductInfo>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <ProductTitle>{product.name}</ProductTitle>
              <ProductPrice>${product.price}</ProductPrice>
              
              <ProductDescription>
                {product.description}
              </ProductDescription>

              {product.features && (
                <ProductFeatures>
                  <h3>Características:</h3>
                  <FeaturesList>
                    {product.features.map((feature, index) => (
                      <FeatureItem key={index}>
                        <strong>{feature.label}:</strong> {feature.value}
                      </FeatureItem>
                    ))}
                  </FeaturesList>
                </ProductFeatures>
              )}

              <ActionButtons>
                <ActionButton
                  className="primary"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiShoppingCart />
                  Agregar al carrito
                </ActionButton>
                
                <ActionButton
                  className="secondary"
                  onClick={() => setIsLiked(!isLiked)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiHeart fill={isLiked ? 'currentColor' : 'none'} />
                  {isLiked ? 'Me gusta' : 'Favorito'}
                </ActionButton>
              </ActionButtons>

              <ShareButtons>
                <span>Compartir:</span>
                <ShareButton onClick={handleShare}>
                  <FiShare2 />
                </ShareButton>
              </ShareButtons>
            </motion.div>
          </ProductInfo>
        </ProductLayout>

        {relatedProducts.length > 0 && (
          <RelatedProducts>
            <SectionTitle>Productos relacionados</SectionTitle>
            <RelatedGrid>
              {relatedProducts.map((relatedProduct, index) => (
                <RelatedCard
                  key={relatedProduct._id}
                  as={Link}
                  to={`/tienda/${relatedProduct._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <RelatedImage image={relatedProduct.image} />
                  <RelatedInfo>
                    <RelatedTitle>{relatedProduct.name}</RelatedTitle>
                    <RelatedPrice>${relatedProduct.price}</RelatedPrice>
                  </RelatedInfo>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </RelatedProducts>
        )}
      </Container>
    </DetailContainer>
  );
};

export default StoreDetail; 