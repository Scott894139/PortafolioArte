import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CheckoutContainer = styled.div`
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

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
  
  input[type="radio"]:checked + & {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
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

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  h4 {
    margin: 0;
    font-size: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  span {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.gray};
  }
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

const PlaceOrderButton = styled(motion.button)`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    paymentMethod: 'card'
  });

  const orderItems = [
    {
      id: 1,
      title: 'Print Premium "Fantasía Mágica"',
      price: 45.00,
      quantity: 2,
      image: '/api/placeholder/60/60'
    },
    {
      id: 2,
      title: 'Sticker Pack Personajes',
      price: 15.00,
      quantity: 1,
      image: '/api/placeholder/60/60'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Procesar pedido
    navigate('/orden-exitosa');
  };

  return (
    <CheckoutContainer>
      <Helmet>
        <title>Checkout - Artista Digital</title>
        <meta name="description" content="Finaliza tu compra de forma segura." />
      </Helmet>

      <Container>
        <Header>
          <Title>Checkout</Title>
        </Header>

        <CheckoutContent>
          <CheckoutForm onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiUser />
                Información personal
              </SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Nombre *</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Apellido *</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiMapPin />
                Dirección de envío
              </SectionTitle>
              <FormGroup>
                <Label>Dirección *</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label>Ciudad *</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Código Postal *</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label>País *</Label>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un país</option>
                  <option value="ES">España</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="CO">Colombia</option>
                  <option value="PE">Perú</option>
                </Select>
              </FormGroup>
            </Section>

            <Section>
              <SectionTitle>
                <FiCreditCard />
                Método de pago
              </SectionTitle>
              <PaymentOptions>
                <PaymentOption>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <FiCreditCard />
                  Tarjeta de crédito/débito
                </PaymentOption>
                <PaymentOption>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  💳 PayPal
                </PaymentOption>
              </PaymentOptions>
            </Section>
          </CheckoutForm>

          <OrderSummary>
            <SummaryTitle>Tu pedido</SummaryTitle>
            
            {orderItems.map(item => (
              <SummaryItem key={item.id}>
                <ItemInfo>
                  <ItemImage>
                    <img src={item.image} alt={item.title} />
                  </ItemImage>
                  <ItemDetails>
                    <h4>{item.title}</h4>
                    <span>Cantidad: {item.quantity}</span>
                  </ItemDetails>
                </ItemInfo>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </SummaryItem>
            ))}
            
            <SummaryRow>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Envío:</span>
              <span>${shipping.toFixed(2)}</span>
            </SummaryRow>
            <SummaryRow className="total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </SummaryRow>
            
            <PlaceOrderButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
            >
              <FiLock />
              Realizar pedido
            </PlaceOrderButton>
          </OrderSummary>
        </CheckoutContent>
      </Container>
    </CheckoutContainer>
  );
};

export default Checkout; 