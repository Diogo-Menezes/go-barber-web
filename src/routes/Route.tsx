import React from 'react';
import {
  RouteProps,
  Route as ReactRouterDom,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';
// import { Container } from './styles';

interface Props extends RouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<Props> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactRouterDom
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              state: { from: location },
              pathname: isPrivate ? '/' : '/dashboard',
            }}
          />
        );
      }}
    />
  );
};
export default Route;
