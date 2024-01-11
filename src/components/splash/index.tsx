'use client';
import { Giro as GiroLogo } from '@grc/_shared/assets/svgs';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

type LoginProps = {
  mobileResponsive: boolean;
  theme: string;
};

type GiroSystemsProps = {
  title: string;
  url: string;
  icon: ReactElement;
};

const SplashScreen = (props: LoginProps) => {
  const {} = props;

  const { push } = useRouter();

  const giroSystems: GiroSystemsProps[] = [
    {
      title: 'Giro Debit',
      url: '/giro-debit',
      icon: <GiroLogo />,
    },
    {
      title: 'Giro Mandate',
      url: '/giro-mandate',
      icon: <GiroLogo />,
    },
  ];
  return (
    <div className="flex justify-center items-center flex-col gap-10">
      <div className="flex font-semibold" style={{ fontSize: '32px' }}>
        Please select a Giro system
      </div>
      <div className="flex gap-10">
        {giroSystems.map(({ title, icon, url }, idx) => {
          return (
            <div
              key={idx}
              className="w-60 h-60 shadow-sm relative border flex justify-center items-center cursor-pointer hover:bg-slate-50"
              onClick={() => push(url)}
            >
              <span className="absolute inline-block bg-blue-500 text-sm text-white py-1 px-2 bg-blue top-2 right-0">
                {title}
              </span>
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplashScreen;
