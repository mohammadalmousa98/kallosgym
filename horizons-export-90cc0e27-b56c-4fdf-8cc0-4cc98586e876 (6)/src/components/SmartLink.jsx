import React from 'react';
import { Link } from 'react-router-dom';

const SmartLink = ({ to, children, ...props }) => {
  const isExternal = to && (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:'));

  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to || '#'} {...props}>
      {children}
    </Link>
  );
};

export default SmartLink;