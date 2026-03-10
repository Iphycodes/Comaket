import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  // Add your prop types here
  toggleSider: boolean;
}

const SideNavHeader: React.FC<Props> = ({ toggleSider }) => {
  const { push } = useRouter();
  return (
    <div className="flex flex-col justify-start min-h-20 items-start gap-10 mt-5 px-7">
      {!toggleSider && (
        <div className="flex justify-between w-full items-center">
          <span className="cursor-pointer" onClick={() => push('/')}>
            <Image
              priority
              src={`/assets/imgs/kraft-logo-new-1.png`}
              alt="giro-logo"
              style={{ width: '100px', height: '60px' }}
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
