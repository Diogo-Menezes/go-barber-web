import React from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';

// eslint-disable-next-line import/no-cycle
import { ToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  toast: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  success: <FiCheckCircle size={24} />,
  error: <FiAlertCircle size={24} />,
};
const Toast: React.FC<ToastProps> = ({ toast, style }) => {
  const { removeToast } = useToast();

  const { id, title, description, type } = toast;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return clearImmediate(timer);
  }, [id, removeToast]);

  return (
    <Container
      type={type || 'info'}
      hasDescription={Number(!!description)}
      style={style}
    >
      {icons[type || 'info']}
      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => {
          removeToast(id);
        }}
      >
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
