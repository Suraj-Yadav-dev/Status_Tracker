import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false }) => {
  const variants = {
    primary: { bg: '#2196f3', color: '#fff' },
    success: { bg: '#4caf50', color: '#fff' },
    outline: { bg: 'transparent', color: '#333', border: '1px solid #ccc' }
  };

  const style = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        borderRadius: '4px',
        border: style.border || 'none',
        backgroundColor: style.bg,
        color: style.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        transition: 'opacity 0.2s',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </button>
  );
};

export default Button;