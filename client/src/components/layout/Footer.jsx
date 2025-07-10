import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.white};
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.wide};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[300]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const Newsletter = styled.div`
  margin-top: 1rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NewsletterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[700]};
  padding-top: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[400]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    text-align: left;
  }
`;

const FooterBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
`;

const LegalLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gray[400]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de newsletter
    console.log('Newsletter subscription');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>Sobre Mí</h3>
            <FooterDescription>
              Soy un artista digital especializado en crear obras únicas que combinan 
              técnicas tradicionales con herramientas digitales modernas. Mi pasión es 
              dar vida a ideas creativas y emocionar a través del arte.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FiInstagram />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter />
              </SocialLink>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FiFacebook />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Navegación</h3>
            <FooterLinks>
              <FooterLink to="/">Inicio</FooterLink>
              <FooterLink to="/galeria">Galería</FooterLink>
              <FooterLink to="/sobre-mi">Sobre Mí</FooterLink>
              <FooterLink to="/proyectos">Proyectos</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/tienda">Tienda</FooterLink>
              <FooterLink to="/contacto">Contacto</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Contacto</h3>
            <ContactInfo>
              <ContactItem>
                <FiMail />
                <span>info@artistadigital.com</span>
              </ContactItem>
              <ContactItem>
                <FiPhone />
                <span>+1 (555) 123-4567</span>
              </ContactItem>
              <ContactItem>
                <FiMapPin />
                <span>Ciudad, País</span>
              </ContactItem>
            </ContactInfo>
          </FooterSection>
          
          <FooterSection>
            <h3>Newsletter</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '1rem' }}>
              Suscríbete para recibir actualizaciones sobre nuevas obras y proyectos.
            </p>
            <Newsletter>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput 
                  type="email" 
                  placeholder="Tu email"
                  required
                />
                <NewsletterButton type="submit">
                  Suscribirse
                </NewsletterButton>
              </NewsletterForm>
            </Newsletter>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <FooterBottomContent>
            <Copyright>
              © 2024 Artista Digital. Todos los derechos reservados.
            </Copyright>
            <LegalLinks>
              <LegalLink to="/privacidad">Privacidad</LegalLink>
              <LegalLink to="/terminos">Términos</LegalLink>
              <LegalLink to="/cookies">Cookies</LegalLink>
            </LegalLinks>
          </FooterBottomContent>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 