import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProvideAuth } from './hooks/useAuth';

const Authenticate = React.lazy(async () => ({
  default: (await import('./components/Authenticate')).Authenticate,
}));

const NotFound = React.lazy(async () => ({
  default: (await import('./components/NotFound')).NotFound,
}));

const Dashboard = React.lazy(async () => ({
  default: (await import('./components/MyDiffs')).MyDiffs,
}));

import { GlobalStyle } from './App.style';
import { MyDiffs } from './components/MyDiffs';
import { NeedMyReviewDiffs } from './components/NeedMyReviewDiffs';
import { ROUTES, routes } from './routes';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const App = (): JSX.Element => {
  return (
    <ProvideAuth>
      <Router>
        <GlobalStyle />
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Authenticate />} />
            <Route path={routes[ROUTES.MY_DIFFS].path} element={<MyDiffs />} />
            <Route
              path={routes[ROUTES.NEED_MY_REVIEW].path}
              element={<NeedMyReviewDiffs />}
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </Router>
    </ProvideAuth>
  );
};
