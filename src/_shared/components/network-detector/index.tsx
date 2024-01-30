import { Detector } from 'react-detect-offline';
import { ReactNode } from 'react';
import { App } from 'antd';
import styled from 'styled-components';

type NetWorkDetectorType = {
  children: ReactNode;
};

const NetWorkDetector = (props: NetWorkDetectorType) => {
  const { children } = props;
  const { notification } = App.useApp();

  const onNetWorkChange = (online: boolean) => {
    if (!online) {
      notification.open({
        message: (
          <span>
            You're currently offline. Check your connections.{' '}
            <a className="underline" style={{ margin: 0 }} onClick={() => window.location.reload()}>
              Refresh Page
            </a>
          </span>
        ),
        placement: 'topLeft',
        duration: 0,
        icon: (
          <StyledIcon>
            <i className="ri-wifi-off-line" />
          </StyledIcon>
        ),
        key: '@@FAV-INTERNET_NOTIFICATION',
      });
    } else {
      notification.open({
        message: <span>Your internet connection was restored.</span>,
        duration: 4,
        placement: 'topLeft',
        icon: (
          <StyledIcon>
            <i className="ri-wifi-line" />
          </StyledIcon>
        ),
        key: '@@FAV-INTERNET_NOTIFICATION',
      });
    }
  };

  return <Detector render={() => <>{children}</>} onChange={onNetWorkChange} />;
};

export default NetWorkDetector;

const StyledIcon = styled.span`
  i {
    font-size: 20px !important;
  }

  i.ri-wifi-off-line {
    color: #ff4d4f !important;
  }

  i.ri-wifi-line {
    color: #36a593 !important;
  }
`;
