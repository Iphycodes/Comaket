import { motion } from 'framer-motion';

type LoginProps = {
  mobileResponsive: boolean;
  theme: string;
};

const Login = (props: LoginProps) => {
  const {} = props;
  return (
    <motion.main
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
    >
      <div style={{ minHeight: '100vh' }}>Login Screen</div>
    </motion.main>
  );
};

export default Login;
