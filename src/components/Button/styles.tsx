import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  height: 56px;
  width: 100%;
  padding: 0 16px;
  background: #ff9000;
  color: #312e38;
  border-radius: 10px;
  border: 0;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${shade(0.2, '#ff9000')};
  }
`;
