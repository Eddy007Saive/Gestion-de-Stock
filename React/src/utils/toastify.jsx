
import { toast } from 'react-toastify';

const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const notifyError = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
  });
};

const notifyInfo = (message) => {
  toast.info(message, {
    position: "top-left",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const notifyWarning = (message) => {
  toast.warn(message, {
    position: "bottom-left",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Exporter les fonctions de notification
export default {
  success: notifySuccess,
  error: notifyError,
  info: notifyInfo,
  warning: notifyWarning
};
