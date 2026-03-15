import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';

interface Props {
  toggleSider: boolean;
}

const SideNavHeader: React.FC<Props> = ({ toggleSider }) => {
  const { push } = useRouter();
  const { theme } = useTheme();
  return (
    <div className="flex flex-col justify-start min-h-20 items-start gap-10 mt-5 px-7">
      {!toggleSider && (
        <div className="flex justify-between w-full items-center">
          <span className="cursor-pointer" onClick={() => push('/')}>
            <Image
              priority
              src={
                theme === 'dark'
                  ? '/assets/imgs/logos/kraft-logo-dark.png'
                  : '/assets/imgs/logos/kraft-logo-light.png'
              }
              alt="Kraft logo"
              style={{ width: '80px', height: '40px' }}
              width={200}
              height={200}
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default SideNavHeader;
