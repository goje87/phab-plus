import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { routes, ROUTES } from '../routes';
import { PageWrapper } from './PageWrapper';
import { SignIn } from './SignIn';

export const Authenticate = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (auth.isFetched && auth.isAuthenticated) {
      window.location.href = routes[ROUTES.MY_DIFFS].path;
    } else if (auth.isFetched) {
      setIsLoaded(true);
    }
  }, [auth]);

  return (
    <PageWrapper showHeader={false}>
      {!isLoaded && null}
      {isLoaded && <SignIn />}
    </PageWrapper>
  );
};
