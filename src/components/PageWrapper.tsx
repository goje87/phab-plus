import React from 'react';
import { Container, Navbar } from '../App.style';
import Header from './Header';

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
      {children}
    </Container>
  );
};
