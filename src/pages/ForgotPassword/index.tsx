import React, { useState } from 'react';

import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = React.useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = React.useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('You must enter your email')
            .email('Enter a valid email'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/password/forgot', { email: data.email });
        addToast({
          type: 'success',
          title: 'Recovery password email sent successfully',
          description: 'Check your email box to finish the recovery process',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        addToast({
          type: 'error',
          title: 'Error while trying to recover your password',
          description:
            'Something went wrong while trying recover your password, please check your credentials.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recover password</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />
            <Button type="submit" loading={loading}>
              Recover
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Go Back to login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
