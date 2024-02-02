'use client';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Image from 'next/image';

type LoginProps = {
  mobileResponsive: boolean;
  theme: string | undefined;
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
      title: 'Giro Pay',
      url: '/apps/giro-pay/dashboard',
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
              <Fragment key={`${title}-${idx}`}>
                <div
                  key={idx}
                  className="h-40 w-48 rounded-lg dark:bg-zinc-800 shadow-md hover:border hover:border-cyan-100 shadow-gray-200 hover:shadow-cyan-200 relative flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    if (url == '/apps/giro-mandate') {
                      return;
                    }
                    push(url);
                  }}
                >
                  <div className="flex flex-col justify-center items-center font-semibold gap-4 relative">
                    <Image
                      src={logo}
                      alt="logo"
                      width={60}
                      height={60}
                      priority
                      style={{ width: '50px', height: '50px' }}
                    />
                    <span>
                      {title === 'Giro Mandate' ? (
                        <div className="flex flex-col">
                          <div>{title}</div>
                          <div
                            style={{ position: 'absolute', top: '-34px', right: '-50px' }}
                            className=" font-normal text-sm text-white py-0 px-[2px] bg-blue  rounded-tr-lg"
                          >
                            coming soon
                          </div>
                        </div>
                      ) : (
                        title
                      )}
                    </span>
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
