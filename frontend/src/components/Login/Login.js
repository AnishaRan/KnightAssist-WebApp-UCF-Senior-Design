import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import PreLoginNavBar from '../../PreLogin/PreLoginNavBar';
import { Typography, Box, CssBaseline, Grid } from '@mui/material';
import Footer from '../Footer';
import LoginBox from './LoginComponents';
import './Login.css';
import loginBg from './vol.avif';

const defaultTheme = createTheme();

function Login(props) {
  return(
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PreLoginNavBar />
        <Grid container component="main" sx={{ flex: 1 }}>
          <Grid item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(${bgImage})',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}> <img src={loginBg} style={{ minHeight: '100%', minWidth: '100%', height: 'auto' }} alt="Background" className="loginPhoto" /> </Grid>
          <Grid container xs={12} sm={8} md={5} component={Paper} elevation={1} square justifyContent="center" alignItems="center">
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }} >
              <Typography component="h1" variant="h4" sx={{ marginTop: 5 }}>
                Welcome Back!
              </Typography>
              <LoginBox setRole={props.setRole} setTheme={props.setTheme}/>
            </Box>
          </Grid>
        </Grid>
        <Footer />
      </Box>
  </ThemeProvider>
  );
};

export default Login;
