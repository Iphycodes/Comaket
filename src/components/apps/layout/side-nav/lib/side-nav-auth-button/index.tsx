import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { LogIn, LogOut } from 'lucide-react';
import React, { useContext, useState } from 'react';

interface SideNavAuthButtonProps {}

const SideNavAuthButton = ({}: SideNavAuthButtonProps) => {
  // ── TODO: Replace with real auth state from context ─────────────────
  const [isAuthenticated] = useState<boolean>(false);

  const { setIsAuthModalOpen } = useContext(AppContext);
  const isMobile = useMediaQuery(mediaSize.mobile);

  if (!isAuthenticated) {
    return (
      <span
        onClick={() => setIsAuthModalOpen(true)}
        className={`flex items-center gap-2 px-3 rounded-md py-1 ${
          isMobile ? 'text-sm' : ''
        } bg-indigo-100 dark:bg-indigo-900/30 text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors`}
      >
        <LogIn size={16} />
        Sign In
      </span>
    );
  }

  return (
    <span
      onClick={() => console.log('logout')}
      className={`flex items-center gap-2 py-1 ${
        isMobile ? 'text-sm' : ''
      } text-red-500 cursor-pointer`}
    >
      <LogOut size={16} />
      Logout
    </span>
  );
};

export default SideNavAuthButton;
