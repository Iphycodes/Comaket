'use client';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Image from 'next/image';

type LoginProps = {
  mobileResponsive: boolean;
  theme: string;
};

type GiroSystemsProps = {
  title: string;
  url: string;
  logo: string;
};

const Apps = (props: LoginProps) => {
  const {} = props;

  const { push } = useRouter();

  const giroSystems: GiroSystemsProps[] = [
    {
      title: 'Giro Debit',
      url: '/apps/giro-debit/dashboard',
      logo: '/assets/imgs/debit-logo.png',
    },
    {
      title: 'Giro Mandate',
      url: '/apps/giro-mandate',
      logo: '/assets/imgs/mandate-logo.png',
    },
  ];
  return (
    <div className="flex justify-center items-center flex-col gap-10 mt-10">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col text-left text-[24px] font-semibold">
          <div>Giro systems</div>
          <span className="text-[14px] text-gray-500">
            Select a system to explore it's features
          </span>
        </div>

        <div className="flex gap-10">
          {giroSystems.map(({ title, logo, url }, idx) => {
            return (
              <Fragment key={idx}>
                <div
                  key={idx}
                  className="h-40 w-48 rounded-lg shadow-md hover:border hover:border-cyan-100 shadow-gray-200 hover:shadow-cyan-200 relative flex justify-center items-center cursor-pointer"
                  onClick={() => push(url)}
                >
                  <div className="flex flex-col justify-center items-center font-semibold gap-4">
                    <Image
                      src={logo}
                      alt="logo"
                      width={60}
                      height={60}
                      style={{ width: '50px', height: '50px' }}
                    />
                    <span style={{}}>{title}</span>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Apps;
