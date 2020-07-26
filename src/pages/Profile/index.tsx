import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarContainer } from './styles';
import { useAuth, UserObject } from '../../hooks/auth';

interface ProfileData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (formData: ProfileData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('Email is required')
            .email('Enter a valid email'),
          old_password: Yup.string(),

          password: Yup.string().when('old_password', {
            is: val => val.length > 0,
            then: Yup.string()
              .required('Required')
              .min(6, 'Minimum 6 characters'),
          }),

          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => val.length > 0,
              then: Yup.string()
                .required('Required')
                .min(6, 'Minimum 6 characters'),
            })
            .oneOf([Yup.ref('password'), null], "Passwords don't' match"),
        });

        await schema.validate(formData, { abortEarly: false });

        const credentials = {
          name: formData.name,
          email: formData.email,
          ...(formData.old_password
            ? {
                old_password: formData.old_password,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
              }
            : {}),
        };

        const { data } = await api.put<UserObject>('profile', credentials);

        history.push('/dashboard');

        updateUser(data);

        addToast({
          type: 'success',
          title: 'Profile updated',
          description: `Your profile was updated successfully.`,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        addToast({
          type: 'error',
          title: 'Profile update error',
          description:
            'Something went wrong while trying to update your profile, please try again.',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData();
        data.append('avatar', event.target.files[0]);

        const response = await api.patch('/users/avatar', data);

        if (response.status === 200) {
          addToast({
            type: 'success',
            title: 'Avatar Updated',
            description: 'Avatar successfully updated',
          });

          updateUser(response.data);
        }
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <AvatarContainer>
          <img src={user.avatar_url} alt={user.name} />
          <label htmlFor="avatar">
            <input type="file" id="avatar" onChange={handleAvatarChange} />
            <FiCamera />
          </label>
        </AvatarContainer>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{ name: user.name, email: user.email, password: '' }}
        >
          <h1>Profile</h1>
          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          <Input
            containerStyle={{ marginTop: 24 }}
            className="old_password"
            name="old_password"
            icon={FiLock}
            type="password"
            autoComplete="new-password"
            placeholder="Current password"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New Password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirm password"
          />

          <Button type="submit">Confirm changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
