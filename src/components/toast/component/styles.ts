import styled, { css } from 'styled-components';
import { shade } from 'polished';
import { animated } from 'react-spring';

interface ToastProps {
  // toast: string;
  type?: 'info' | 'success' | 'error';
  hasDescription: number;
}

const ToastTypeVariations = {
  info: css`
    background: rgba(235, 248, 255, 0.9);
    color: #3172b7;
  `,
  success: css`
    background: rgba(230, 255, 250, 0.9);
    color: #2e656a;
  `,
  error: css`
    background: rgba(253, 222, 222, 0.9);
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  width: 360px;

  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  display: flex;

  & + div {
    margin-top: 8px;
  }

  /* TODO - change background and color to follow the them */
  ${props => ToastTypeVariations[props.type || 'info']}

  svg {
    margin: 0 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }
  button {
    position: absolute;
    top: 15px;
    right: 16px;
    opacity: 0.8;
    border: 0;
    background: transparent;
    color: inherit;
    transition: color 0.3s;

    &:hover {
      color: ${shade(0.01, '#f39000')};
    }
    ${props =>
      !props.hasDescription &&
      css`
        align-items: center;
      `}
  }
`;
