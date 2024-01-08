import styled from 'styled-components';
import Link from 'next/link';

export const StyleErrorPage = styled.main<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? '90%' : '400px')};
  font-weight: bold;
  margin: 100px auto 0 auto;

  div:first-child {
    font-size: 4rem;

    span {
      font-size: 3.4rem;
    }
  }

  div:nth-child(2) {
    font-size: ${(props) => (props.isMobile ? '1.5rem' : '1.8rem')};
  }

  div:nth-child(3) {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: normal;
  }
`;

export const StyledLink = styled(Link)`
  font-size: 1.3rem;
`;
