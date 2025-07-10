import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiSend } from 'react-icons/fi';
import { contactService } from '../services/api';
import { useLoading } from '../context/LoadingContext';
import { toast } from 'react-toastify';

const ContactContainer = styled.div`
  padding: 6rem 0 4rem;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.wide};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const ContactTitle = styled.h1`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.heading};
`;

const ContactDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.heading};
    margin-bottom: 1rem;
  }
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.sm};
  margin-bottom: 1rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadow.md};
  }
`;

const ContactIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  font-size: 1.25rem;
`;

const ContactDetails = styled.div`
  flex: 1;
  
  h4 {
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.colors.heading};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
    margin: 0;
  }
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
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.md};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &.error {
    border-color: ${({ theme }) => theme.colors.error};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &.error {
    border-color: ${({ theme }) => theme.colors.error};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background: white;
  transition: border-color ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormError = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.standard};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      showLoading('Enviando mensaje...');
      
      await contactService.send(data);
      
      toast.success('Mensaje enviado exitosamente. Te contactaré pronto.');
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error enviando mensaje. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  return (
    <>
      <Helmet>
        <title>Contacto - Artista Digital</title>
        <meta name="description" content="Ponte en contacto conmigo para colaboraciones, comisiones o consultas sobre arte digital." />
      </Helmet>

      <ContactContainer>
        <Container>
          <ContactHeader>
            <ContactTitle>Contacto</ContactTitle>
            <ContactDescription>
              ¿Tienes una idea en mente? Me encantaría escuchar tu proyecto y 
              ayudarte a convertirlo en una obra de arte digital única.
            </ContactDescription>
          </ContactHeader>

          <ContactContent>
            <ContactInfo>
              <InfoSection>
                <h3>Información de Contacto</h3>
                
                <ContactMethod>
                  <ContactIcon>
                    <FiMail />
                  </ContactIcon>
                  <ContactDetails>
                    <h4>Email</h4>
                    <p>info@artistadigital.com</p>
                  </ContactDetails>
                </ContactMethod>

                <ContactMethod>
                  <ContactIcon>
                    <FiPhone />
                  </ContactIcon>
                  <ContactDetails>
                    <h4>Teléfono</h4>
                    <p>+1 (555) 123-4567</p>
                  </ContactDetails>
                </ContactMethod>

                <ContactMethod>
                  <ContactIcon>
                    <FiMapPin />
                  </ContactIcon>
                  <ContactDetails>
                    <h4>Ubicación</h4>
                    <p>Ciudad, País</p>
                  </ContactDetails>
                </ContactMethod>
              </InfoSection>

              <InfoSection>
                <h3>Sígueme en redes</h3>
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
              </InfoSection>

              <InfoSection>
                <h3>Horarios de Atención</h3>
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 4:00 PM</p>
                <p>Domingo: Cerrado</p>
              </InfoSection>
            </ContactInfo>

            <ContactForm
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FormGroup>
                <FormLabel htmlFor="name">Nombre completo *</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  className={errors.name ? 'error' : ''}
                  {...register('name', { required: 'El nombre es requerido' })}
                />
                {errors.name && <FormError>{errors.name.message}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="email">Email *</FormLabel>
                <FormInput
                  id="email"
                  type="email"
                  className={errors.email ? 'error' : ''}
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && <FormError>{errors.email.message}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="phone">Teléfono</FormLabel>
                <FormInput
                  id="phone"
                  type="tel"
                  {...register('phone')}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="type">Tipo de consulta</FormLabel>
                <FormSelect
                  id="type"
                  {...register('type')}
                >
                  <option value="general">Consulta general</option>
                  <option value="colaboracion">Colaboración</option>
                  <option value="comision">Comisión</option>
                  <option value="compra">Compra de obra</option>
                  <option value="otros">Otros</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="budget">Presupuesto estimado</FormLabel>
                <FormSelect
                  id="budget"
                  {...register('budget')}
                >
                  <option value="no-especificado">No especificado</option>
                  <option value="menos-500">Menos de $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="mas-5000">Más de $5,000</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="timeline">Tiempo estimado</FormLabel>
                <FormSelect
                  id="timeline"
                  {...register('timeline')}
                >
                  <option value="flexible">Flexible</option>
                  <option value="urgente">Urgente</option>
                  <option value="1-semana">1 semana</option>
                  <option value="2-4-semanas">2-4 semanas</option>
                  <option value="1-2-meses">1-2 meses</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="subject">Asunto *</FormLabel>
                <FormInput
                  id="subject"
                  type="text"
                  className={errors.subject ? 'error' : ''}
                  {...register('subject', { required: 'El asunto es requerido' })}
                />
                {errors.subject && <FormError>{errors.subject.message}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="message">Mensaje *</FormLabel>
                <FormTextarea
                  id="message"
                  placeholder="Cuéntame sobre tu proyecto..."
                  className={errors.message ? 'error' : ''}
                  {...register('message', { required: 'El mensaje es requerido' })}
                />
                {errors.message && <FormError>{errors.message.message}</FormError>}
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="projectDetails">Detalles del proyecto</FormLabel>
                <FormTextarea
                  id="projectDetails"
                  placeholder="Describe con más detalle tu proyecto, referencias, estilo deseado, etc."
                  {...register('projectDetails')}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                <FiSend />
              </SubmitButton>
            </ContactForm>
          </ContactContent>
        </Container>
      </ContactContainer>
    </>
  );
};

export default Contact; 