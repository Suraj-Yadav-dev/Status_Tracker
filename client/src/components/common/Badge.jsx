import React from 'react';

const Badge = ({ status }) => {
  const styles = {
    active: { backgroundColor: '#2196f3', color: '#fff' },
    completed: { backgroundColor: '#4caf50', color: '#fff' },
    inactive: { backgroundColor: '#9e9e9e', color: '#fff' },
    default: { backgroundColor: '#eceff1', color: '#455a64' }
  };

  const currentStyle = styles[status.toLowerCase()] || styles.default;

  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'inline-block',
      ...currentStyle
    }}>
      {status}
    </span>
  );
};

export default Badge;