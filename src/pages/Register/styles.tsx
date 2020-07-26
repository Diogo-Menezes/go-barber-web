import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import RegisterBackground from '../../assets/register-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;
`;
export const Background = styled.div`
  flex: 1;
  background: url(${RegisterBackground}) no-repeat center;
  background-size: cover;
`;

const appearFromTheRight = keyframes`
  from {
    transform: translateX(50px);
    opacity:0;
  }

  to {
    transform: translateX(0px);
    opacity:1;
    }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  animation: ${appearFromTheRight} 1s;
  form {
    margin-top: 80px;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.3s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    color: #f4ede8;
    display: block;
    margin-top: 24px;
    transition: color 0.3s;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 4px;
    }
  }
`;
