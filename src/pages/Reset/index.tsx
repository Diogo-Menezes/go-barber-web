import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';

interface ResetPasswordFormData {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().min(
            6,
            'The password should have at least 6 characters',
          ),

          password_confirmation: Yup.string()
            .min(6, 'The password should have at least 6 characters')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        });

        await schema.validate(data, { abortEarly: false });

        const token = history.location.search.replace('?token=', '');

        if (!token) {
          throw new Error('');
        }
        await api.post('password/reset', {
          password: data.password,
          password_confirmation: data.passwordConfirmation,
          token,
        });
        history.push('/');

        addToast({
          type: 'success',
          title: 'Reset password success',
          description: `You may login with your new password`,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        addToast({
          type: 'error',
          title: 'Reset password error',
          description:
            'Something went wrong while trying to reset your password, please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Go Barber logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset password</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Password confirmation"
            />
            <Button type="submit">Reset Password</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
