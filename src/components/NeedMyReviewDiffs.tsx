import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SIGN_OUT_USER } from '../graphql/mutations';
import { Container, Heading } from '../styles/Dashboard.style';
import { NextButton, ButtonWrap } from '../styles/Authenticate.style';
import { GET_DIFFERENTIALS } from '../graphql/queries';
import Header from './Header';
import { PageWrapper } from './PageWrapper';

export const NeedMyReviewDiffs = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  const redirect = (path: string) => (window.location.href = path);

  const [signOutUser] = useMutation(SIGN_OUT_USER, {
    onCompleted: (): void => {
      redirect('/');
    },
  });

  const [getDifferentials] = useLazyQuery(GET_DIFFERENTIALS, {
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
  return (
    <PageWrapper showHeader>
      {!isLoaded && null}
      {isLoaded && (
        <Container>
          <NextButton onClick={() => getDifferentials()}>callQuery</NextButton>
          <Heading className='animate__animated animate__fadeInDown'>
            Authenticated
          </Heading>
          <ButtonWrap style={{ width: 'unset' }}>
            <NextButton onClick={() => signOutUser()}>Sign Out</NextButton>
          </ButtonWrap>
        </Container>
      )}
    </PageWrapper>
  );
};
