import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import PreLoginNavBar from '../../PreLogin/PreLoginNavBar';
import { Grid, Typography, Button, Box } from '@mui/material';
import SignUp from './SignUp';
import Footer from '../Footer';
import registerBg from './registerBg.avif';

const defaultTheme = createTheme();

export default function Register() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <>
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
            }}> <img src={registerBg} style={{ minHeight: '100%', minWidth: '100%', height: 'auto' }} alt="Background" className="loginPhoto" /> </Grid>
          <Grid container xs={12} sm={8} md={5} component={Paper} elevation={1} square justifyContent="center" alignItems="center">
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }} >
              <SignUp />
            </Box>
          </Grid>
        </Grid>
        <Footer />
      </Box>
    </ThemeProvider></>
  );
}