import styled, { css } from 'styled-components';
import { lighten } from 'polished';

import Tooltip from '../Tooltip';

interface ContainerProps {
  hasFocus: boolean;
  isFilled: boolean;
  hasError: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;

  background: #232129;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 0 16px;
  width: 100%;
  color: #666360;
  transition: background-color 0.3s, border-color 0.8s;

  & + div {
    margin-top: 8px;
  }

  ${props =>
    props.hasError &&
    css`
      border-color: #c53030;
    `}


  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
      border-color: #232129;
    `}

  ${props =>
    props.hasFocus &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}
  &:hover {
    background-color: ${lighten(0.02, '#232129')};
  }

  svg {
    margin-right: 16px;
  }

  input {
    padding: 4px 0;
    height: 56px;
    background-color: transparent;
    border: 0;
    flex: 1;
    color: #f4ede8;
    margin-right:16px;

    &::placeholder {
      color: #666360;
    }
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 10px;

  svg {
    color: #c53030;
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
