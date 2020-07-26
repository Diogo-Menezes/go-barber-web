import React from 'react';
import { useTransition } from 'react-spring';
// eslint-disable-next-line import/no-cycle
import { ToastMessage } from '../../../hooks/toast';

// eslint-disable-next-line import/no-cycle
import Toast from '../component/index';

import { Container } from './styles';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const toastsWithTransition = useTransition(toasts, toast => toast.id, {
    from: { right: '-120%' },
    enter: { right: '0%' },
    leave: { right: '-120%' },
  });

  return (
    <Container>
      {toastsWithTransition.map(({ item, key, props }) => (
        <Toast key={key} toast={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
