'use client';

type LoginProps = {
  mobileResponsive: boolean;
  theme: string;
};

const SplashScreen = (props: LoginProps) => {
  const {} = props;
  return (
    <div className="flex justify-center gap-2">
      <div className="flex-1 w-100 h-100 bg-blue"></div>
      <div className="flex-1 w-100 h-100 bg-blue"></div>
      <div className="flex-1 w-100 h-100 bg-blue"></div>
    </div>
  );
};

export default SplashScreen;
