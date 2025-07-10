import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CartContainer = styled.div`
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

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItem = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  align-items: center;
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ItemPrice = styled.span`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.colors.primary};
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border-radius: 4px;
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

const Quantity = styled.span`
  font-weight: bold;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled(motion.button)`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff4444;
    color: white;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &.total {
    font-weight: bold;
    font-size: 1.2rem;
    color: ${props => props.theme.colors.primary};
    border-top: 2px solid ${props => props.theme.colors.lightGray};
    padding-top: 1rem;
  }
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 1rem;
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga del carrito
    setTimeout(() => {
      setCartItems([
        {
          id: 1,
          title: 'Print Premium "Fantasía Mágica"',
          price: 45.00,
          quantity: 2,
          image: '/api/placeholder/120/120'
        },
        {
          id: 2,
          title: 'Sticker Pack Personajes',
          price: 15.00,
          quantity: 1,
          image: '/api/placeholder/120/120'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateQuantity = (id, change) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <CartContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando carrito...</p>
          </div>
        </Container>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Helmet>
        <title>Carrito de Compras - Artista Digital</title>
        <meta name="description" content="Revisa y finaliza tu compra de productos únicos." />
      </Helmet>

      <Container>
        <Header>
          <Title>Carrito de Compras</Title>
        </Header>

        {cartItems.length === 0 ? (
          <EmptyCart>
            <EmptyCartIcon>🛒</EmptyCartIcon>
            <h2>Tu carrito está vacío</h2>
            <p>Descubre productos únicos en nuestra tienda.</p>
            <ShopButton to="/tienda">
              <FiShoppingBag />
              Ir a la tienda
            </ShopButton>
          </EmptyCart>
        ) : (
          <CartContent>
            <CartItems>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ItemImage>
                    <img src={item.image} alt={item.title} />
                  </ItemImage>
                  
                  <ItemInfo>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  </ItemInfo>
                  
                  <ItemControls>
                    <QuantityControls>
                      <QuantityButton onClick={() => updateQuantity(item.id, -1)}>
                        <FiMinus size={14} />
                      </QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton onClick={() => updateQuantity(item.id, 1)}>
                        <FiPlus size={14} />
                      </QuantityButton>
                    </QuantityControls>
                    
                    <RemoveButton
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeItem(item.id)}
                    >
                      <FiTrash2 size={16} />
                    </RemoveButton>
                  </ItemControls>
                </CartItem>
              ))}
            </CartItems>

            <OrderSummary>
              <SummaryTitle>Resumen del pedido</SummaryTitle>
              <SummaryRow>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Envío:</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </SummaryRow>
              <SummaryRow className="total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </SummaryRow>
              
              <CheckoutButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
              >
                Proceder al pago
              </CheckoutButton>
            </OrderSummary>
          </CartContent>
        )}
      </Container>
    </CartContainer>
  );
};

export default Cart; 