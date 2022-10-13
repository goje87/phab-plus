import styled from '@emotion/styled';
import React from 'react';
import { Container, Navbar } from '../App.style';
import Header from './Header';

const Content = styled.div`
  padding: 98px 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const PageWrapper: React.FC<{ showHeader: boolean }> = ({
  showHeader,
  children,
}) => {
  return (
    <Container>
      {showHeader && (
        <Navbar>
          <Header />
        </Navbar>
      )}
      <Content>{children}</Content>
    </Container>
  );
};
