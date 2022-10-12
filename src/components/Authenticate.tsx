import * as React from 'react';
import { useAuth } from '../hooks/useAuth';
import { SignIn } from './SignIn';

export const Authenticate = (): JSX.Element => {
  const auth = useAuth();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (auth.isFetched && auth.isAuthenticated) {
      window.location.href = '/dashboard';
    } else if (auth.isFetched) {
      setIsLoaded(true);
    }
  }, [auth]);

  return (
    <>
      {!isLoaded && null}
      {isLoaded && <SignIn />}
    </>
  );
};
