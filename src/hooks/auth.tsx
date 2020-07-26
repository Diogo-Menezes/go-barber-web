import React from 'react';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

export interface UserObject {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  [key: string]: any;
}

interface AuthContextData {
  user: UserObject;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: UserObject): void;
}

interface AuthState {
  token: string;
  user: UserObject;
}

const STORAGE_TOKEN = '@GoBarber:token';
const STORAGE_USER = '@GoBarber:user';

const AuthContext = React.createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = React.useState<AuthState>(() => {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const user = localStorage.getItem(STORAGE_USER);

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = React.useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });

    const { token, user } = response.data;

    localStorage.setItem(STORAGE_TOKEN, token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = React.useCallback(() => {
    if (!data) {
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_TOKEN);
    }

    api.defaults.headers.authorization = ``;

    setData({} as AuthState);
  }, [data]);

  const updateUser = React.useCallback(
    (user: UserObject) => {
      setData({ token: data.token, user });
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('Must implement Auth Provider');
  }

  return context;
}
