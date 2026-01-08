'use client'

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => {
  return (
    <ToastContainer
      aria-label="Notification"
      position="top-right"
      autoClose={3500}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastProvider;
