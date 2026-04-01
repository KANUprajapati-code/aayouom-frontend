import React from 'react';

const SchemeBadge = ({ scheme, type = 'orange' }) => {
  const styles = {
    orange: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    green: 'bg-secondary-100 text-secondary-600 border-secondary-200',
    blue: 'bg-primary-50 text-primary-600 border-primary-100',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[type]} uppercase tracking-wider`}>
      {scheme}
    </span>
  );
};

export default SchemeBadge;
