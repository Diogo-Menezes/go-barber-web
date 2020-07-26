import React from 'react';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import { useToast } from '../../hooks/toast';

interface SignInData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const formRef = React.useRef<FormHandles>(null);

  const { signIn } = useAuth();

  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = React.useCallback(
    async (data: SignInData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('You must enter your email')
            .email('Enter a valid email'),
          password: Yup.string().required('You must enter a password'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn(data);

        // addToast({
        //   type: 'success',
        //   title: 'Authentication Success',
        //   description: `Welcome back`,
        // });

        history.push('/dashboard');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        addToast({
          type: 'error',
          title: 'Authentication Error',
          description:
            'Something went wrong while trying to log you in, please check your credentials.',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Login to your account</h1>

            <Input name="email" icon={FiMail} placeholder="Email" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Login</Button>

            <Link to="/forgot-password">Forget Password</Link>
          </Form>

          <Link to="/register">
            <FiLogIn />
            Register
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default Login;
