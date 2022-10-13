import { useMutation } from '@apollo/client';
import AdbIcon from '@mui/icons-material/Adb';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SIGN_OUT_USER } from '../graphql/mutations';
import { routes } from '../routes';

export const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const redirect = (path: string) => (window.location.href = path);
  const [signOutUser] = useMutation(SIGN_OUT_USER, {
    onCompleted: (): void => {
      redirect('/');
    },
  });

  return (
    <AppBar
      position='static'
      style={{
        backgroundColor: 'white',
        padding: '0 32px',
      }}
    >
      <Container
        style={{
          maxWidth: `calc(100vw - 32px)`,
        }}
      >
        <Toolbar disableGutters>
          <img src='' />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            PHABRICATOR++
          </Typography>

          <Tabs
            value={pathname}
            variant='standard'
            style={{
              marginRight: '40px',
            }}
          >
            {Object.values(routes).map(route => (
              <Tab
                key={route.path}
                component='a'
                value={route.path}
                onClick={(event: any) => {
                  event.preventDefault();
                  if (pathname === route.path) {
                    return;
                  }
                  navigate(route.path);
                }}
                label={route.title}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 0, display: 'flex' }}>
            <Tooltip title='Open settings'>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
              </IconButton>
            </Tooltip>
            <Button variant='text' onClick={() => signOutUser()}>
              Sign Out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
