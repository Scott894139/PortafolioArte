import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiMail, FiHome, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderSuccessContainer = styled.div`
  min-height: 100vh;
  padding: 6rem 0 2rem 0;
  background-color: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SuccessCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessIcon = styled(motion.div)`
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const OrderInfo = styled.div`
  background: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const OrderNumber = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray};
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const EmailNotification = styled.div`
  background: #E3F2FD;
  border: 1px solid #2196F3;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #1976D2;
`;

const ThankYouMessage = styled.div`
  background: #F3E5F5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.gray};
    line-height: 1.6;
    margin: 0;
  }
`;

const OrderSuccess = () => {
  const orderNumber = "ORD-2024-001234";
  const orderDate = new Date().toLocaleDateString();
  const orderTotal = "$115.00";
  const customerEmail = "cliente@ejemplo.com";

  return (
    <OrderSuccessContainer>
      <Helmet>
        <title>Pedido Exitoso - Artista Digital</title>
        <meta name="description" content="Tu pedido ha sido procesado exitosamente. Gracias por tu compra." />
      </Helmet>

      <Container>
        <SuccessCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SuccessIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FiCheckCircle />
          </SuccessIcon>
          
          <Title>¡Pedido Exitoso!</Title>
          <Subtitle>
            Tu pedido ha sido procesado exitosamente. Te hemos enviado un email de confirmación con todos los detalles.
          </Subtitle>

          <OrderInfo>
            <OrderNumber>
              <strong>Número de pedido:</strong> {orderNumber}
            </OrderNumber>
            <OrderDetails>
              <InfoItem>
                <span>Fecha: {orderDate}</span>
              </InfoItem>
              <InfoItem>
                <span>Total: {orderTotal}</span>
              </InfoItem>
            </OrderDetails>
          </OrderInfo>

          <EmailNotification>
            <FiMail />
            <span>
              Hemos enviado la confirmación de tu pedido a <strong>{customerEmail}</strong>
            </span>
          </EmailNotification>

          <ThankYouMessage>
            <h3>¡Gracias por tu compra!</h3>
            <p>
              Tu apoyo significa mucho para mí. Recibirás un email con el seguimiento de tu pedido en breve. 
              Si tienes alguna pregunta, no dudes en contactarme.
            </p>
          </ThankYouMessage>

          <ActionButtons>
            <ActionButton
              as={Link}
              to="/"
              primary
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHome />
              Ir al inicio
            </ActionButton>
            
            <ActionButton
              as={Link}
              to="/tienda"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingBag />
              Seguir comprando
            </ActionButton>
          </ActionButtons>
        </SuccessCard>
      </Container>
    </OrderSuccessContainer>
  );
};

export default OrderSuccess; 