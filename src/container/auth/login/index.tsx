import Login from '@grc/components/auth/login';
import { mediaSize, useMediaQuery } from '@grc/components/_shared/responsiveness';
import { AppContext } from '@grc/app-context';
import { useContext } from 'react';

const LoginContainer = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  return <Login mobileResponsive={mobileResponsive} theme={theme} />;
};

export default LoginContainer;
