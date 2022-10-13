import { useLazyQuery, useQuery } from '@apollo/client';
import * as React from 'react';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import { useAuth } from '../hooks/useAuth';
import { NextButton } from '../styles/Authenticate.style';
import { Container } from '../styles/Dashboard.style';
import { PageWrapper } from './PageWrapper';

export const MyDiffs = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const redirect = (path: string) => (window.location.href = path);
  const { loading, error, data } = useQuery(GET_DIFFERENTIALS, {
    variables: {
      differentialType: 'AUTHORED',
    },
  });

  React.useEffect(() => {
    if (auth.isFetched && auth.isAuthenticated) {
      setIsLoaded(true);
    } else if (auth.isFetched) {
      redirect('/');
    }
  }, [auth]);

  if (!isLoaded) {
    return null;
  }

  return <PageWrapper showHeader></PageWrapper>;
};
