import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Login from '../../pages/Login';

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({ push: mockedHistoryPush }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return { useAuth: () => ({ signIn: jest.fn() }) };
});

describe('Login Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in ', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Login');

    fireEvent.change(emailField, { target: { value: 'jonhdoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials ', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Password');
    const buttonElement = getByText('Login');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
});
