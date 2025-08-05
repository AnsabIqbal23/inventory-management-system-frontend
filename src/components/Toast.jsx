import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-in-out";
    
    if (type === 'success') {
      return `${baseStyles} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-green-600/90 backdrop-blur-sm border border-green-500/50`;
    } else if (type === 'error') {
      return `${baseStyles} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-red-600/90 backdrop-blur-sm border border-red-500/50`;
    } else {
      return `${baseStyles} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} bg-blue-600/90 backdrop-blur-sm border border-blue-500/50`;
    }
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (type === 'error') {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center p-4 rounded-lg shadow-lg min-w-80">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 text-white font-medium">
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              onClose();
            }, 300);
          }}
          className="flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast; 