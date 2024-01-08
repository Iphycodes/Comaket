import styled from 'styled-components';
import { Row, Col } from 'antd';

export const StyledAuthLayoutContainer = styled(Row)`
  position: relative;
  height: 100vh;
  background: #000c17;

  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
  }

  @media (max-width: 769px) {
    width: 100vh;
    height: 100vh;
    top: 0;
  }
`;

export const StyledChildColumn = styled(Col)`
  margin-top: 5%;

  div.child-group {
    min-width: 560px;
    margin: auto;
  }
`;
export const StyledChildrenContainer = styled(Col)<{ theme?: string; increaseWidth?: boolean }>`
  padding: 30px 40px;
  background-color: #fff;
  box-shadow: ${({ theme }) =>
    theme === 'dark'
      ? '0 2px 40px 10px rgba(10, 10, 10, 0.1)'
      : '0 2px 40px 10px rgba(100, 100, 100, 0.1)'};
  border-radius: 20px;
  width: ${({ increaseWidth }) =>
    increaseWidth
      ? 'clamp(min(420px), 540px, max(600px))'
      : 'clamp(min(420px), 420px, max(600px))'};
  min-height: 400px !important;
  margin: 0 auto;

  @media (max-width: 769px) {
    width: 90%;
    min-height: 60vh !important;
  }
`;

export const StyledGiroLogo = styled.div`
  margin: 50px auto;
  text-align: center;
  width: 220px;
`;
