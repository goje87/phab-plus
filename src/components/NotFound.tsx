import * as React from 'react';
import { Heading } from '../styles/Dashboard.style';
import { NextButton, ButtonWrap } from '../styles/Authenticate.style';
import { PageWrapper } from './PageWrapper';

export const NotFound = (): JSX.Element => {
  return (
    <PageWrapper showHeader={false}>
      <Heading>Page Not Found</Heading>
      <ButtonWrap style={{ width: 'unset' }}>
        <NextButton onClick={() => (window.location.href = '/')}>
          Back to Login
        </NextButton>
      </ButtonWrap>
    </PageWrapper>
  );
};
