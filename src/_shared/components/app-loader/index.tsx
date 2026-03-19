import React from 'react';

export const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950">
      <img
        src="/assets/imgs/logos/kraft-logo-splash.png"
        alt="Kraft"
        className="h-24 object-contain animate-pulse"
      />
    </div>
  );
};
