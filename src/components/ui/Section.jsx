import React from 'react';

const Section = ({ children, title, className = '' }) => {
  return (
    <section className={`section ${className}`}>
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </section>
  );
};

export default Section;
