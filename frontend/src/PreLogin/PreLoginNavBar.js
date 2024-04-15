import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useMediaQuery } from '@mui/material';
import KA_Logo from './../KA_Logo.png';
import './PreLoginNavBarButton.css';
import { Link, useLocation } from 'react-router-dom';

const pages = ['Home', 'About', 'Contact'];

function PreLoginNavBar() {
  const location = useLocation();
  
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (page) => {
    console.log("clicked "+page);
    if (page === 'Home') {
      console.log('Redirecting to #/');
      window.location.href = '#/';
      window.location.href = '/#';
    } else if(page === 'About') {
      window.location.href = '#/about';
    }else if(page === 'Contact'){
		  window.location.href = '#/contact';
	  }
    handleCloseNavMenu();
  };

  const handleOpenMenuItemClick = (page) => {
    console.log("clicked "+page);
    if (page === 'Home') {
      console.log('Redirecting to #/');
      window.location.href = '#/';
      window.location.href = '/#';
    } else if(page === 'About') {
      window.location.href = '#/about';
    }else if(page === 'Contact'){
		  window.location.href = '#/contact';
	  }
  };

  const handleClick = (num) => {
    if(num==1){
      window.location.href = '#/register';
    } else if (num==2){
      window.location.href = '#/login';
    }
  };

  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <React.Fragment>
    <AppBar position="absolute" style={{ background: 'transparent', boxShadow: 'none', }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* logo + name */}
          <Box>
            <Box
              component="img"
              onClick={() => window.location.href="/#/"}
              sx={{
                maxHeight: 45,
                mr: 0.5
              }}
              alt="KnightAssist Logo"
              src={KA_Logo}
              className='navBarLogoBtn'
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => window.location.href="/#/"}
              className='navBarLogoBtn'
              sx={{
                mr: 2,
                fontFamily: 'sans-serif',
                fontWeight: 700,
                color: '#744E77',
                textDecoration: 'none',
                ":hover": {color: '#322032'}
              }}>
              KnightAssist
            </Typography>
          </Box>
          
          {/* items to be aligned on the right side  of the appbar */}
          <Box alignItems="center" display="flex" flexDirection="row">
            {/* mobile view of menu tabs + login button */}
            <nav>
            <Box sx={{ flexGrow: 1, display: { md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="#121212"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none'},
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleMenuItemClick(page)} sx={{":hover": { color: '#644064'}}}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem>
                {location.pathname === '/login' ? (
                  <Button variant="contained" sx={{ bgcolor: '#593959', ":hover": {bgcolor: '#322032'}}} onClick={() => handleClick(1)}>Sign Up</Button>
                  ) : (
                    <Button variant="contained" sx={{ bgcolor: '#593959', ":hover": {bgcolor: '#322032'}}} onClick={() => handleClick(2)}>Login</Button>
                  )}
              </MenuItem>
              </Menu>
            </Box>
            </nav>

            {/* desktop view of tabs + login button */}
            {isMediumScreen ? null :
              <>
              <nav>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'} }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleOpenMenuItemClick(page)}
                    sx={{ my: 2, color: '#121212', display: 'block', ":hover": { color:'#A776A7', bgcolor: 'rgba(212, 212, 212, .3)' }}}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              </nav>

              {location.pathname === '/login' ? (
                <Button variant="contained" sx={{ marginLeft: '30px', bgcolor: '#593959', ":hover": {bgcolor: '#322032'}}} onClick={() => handleClick(1)}>Sign Up</Button>
              ) : (
                <Button variant="contained" sx={{ marginLeft: '30px', bgcolor: '#593959', ":hover": {bgcolor: '#322032'}}} onClick={() => handleClick(2)}>Login</Button>
              )}
              </>}
          </Box>
        </Toolbar>
    </AppBar>
    </React.Fragment>
  );
}
export default PreLoginNavBar;