import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiFilter, FiSearch } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const StoreContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.lightGray};
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
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray};
  max-width: 600px;
  margin: 0 auto;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray};
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 250px;
  background: ${props => props.theme.colors.lightGray};
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: ${props => props.theme.colors.gray};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.gray};
`;

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, category, sortBy]);

  const fetchProducts = async () => {
    try {
      showLoading('Cargando productos...');
      
      // Para demo, usar productos de ejemplo directamente
      // En un futuro se puede reactivar: const response = await api.get('/store');
      setProducts([
        {
          _id: '1',
          name: 'Ilustración Digital Personalizada',
          description: 'Retrato digital personalizado en alta resolución',
          price: 75,
          category: 'ilustraciones',
          image: '/images/product1.jpg'
        },
        {
          _id: '2',
          name: 'Diseño de Logo',
          description: 'Logo profesional para tu marca o negocio',
          price: 150,
          category: 'logos',
          image: '/images/product2.jpg'
        },
        {
          _id: '3',
          name: 'Poster Artístico',
          description: 'Poster impreso en papel de alta calidad',
          price: 25,
          category: 'prints',
          image: '/images/product3.jpg'
        },
        {
          _id: '4',
          name: 'Stickers Pack',
          description: 'Pack de stickers con diseños únicos',
          price: 15,
          category: 'prints',
          image: '/images/product4.jpg'
        },
        {
          _id: '5',
          name: 'Diseño de Tarjetas',
          description: 'Diseño personalizado para tarjetas de presentación',
          price: 80,
          category: 'logos',
          image: '/images/product5.jpg'
        },
        {
          _id: '6',
          name: 'Retrato Familiar',
          description: 'Ilustración digital de la familia completa',
          price: 120,
          category: 'ilustraciones',
          image: '/images/product6.jpg'
        }
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      hideLoading();
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success('Producto agregado al carrito');
  };

  return (
    <StoreContainer>
      <Helmet>
        <title>Tienda - Artista Digital</title>
        <meta name="description" content="Compra ilustraciones digitales, logos y productos artísticos únicos." />
      </Helmet>

      <Container>
        <Header>
          <Title>Tienda</Title>
          <Subtitle>
            Descubre mi colección de ilustraciones digitales, logos y productos artísticos únicos
          </Subtitle>
        </Header>

        <FilterBar>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </SearchBox>

          <FilterSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            <option value="ilustraciones">Ilustraciones</option>
            <option value="logos">Logos</option>
            <option value="prints">Prints</option>
          </FilterSelect>

          <FilterSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Ordenar por nombre</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
          </FilterSelect>
        </FilterBar>

        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductImage image={product.image} />
                <ProductInfo>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductPrice>${product.price}</ProductPrice>
                  <ProductActions>
                    <ActionButton
                      as={Link}
                      to={`/tienda/${product._id}`}
                      className="secondary"
                    >
                      Ver detalles
                    </ActionButton>
                    <ActionButton
                      className="primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FiShoppingCart />
                      Agregar
                    </ActionButton>
                  </ProductActions>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        ) : (
          <EmptyState>
            <h3>No se encontraron productos</h3>
            <p>Intenta cambiar los filtros de búsqueda</p>
          </EmptyState>
        )}
      </Container>
    </StoreContainer>
  );
};

export default Store; 