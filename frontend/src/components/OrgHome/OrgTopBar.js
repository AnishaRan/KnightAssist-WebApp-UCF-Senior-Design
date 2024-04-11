import React, { useEffect, useState } from 'react';
import Logo from '../Logo';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '../../path';

function OrgTopBar(props)
{
    const settings = ['Profile', 'Sign Out'];
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
	const [picName, setPicName] = useState(null);

	const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};
    
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	async function getProfilePic(){
		let id = sessionStorage.getItem("ID");

		const url = buildPath(`api/retrieveImage?typeOfImage=2&id=${id}`);

		const response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});

		let pic = JSON.parse(await response.text());

		setPicName(pic.url);
	}

	function handleButtonClick(setting){
		if(setting === "Profile"){
			sessionStorage.removeItem("viewingPageID"); 
			if(window.location.href.substring(window.location.href.lastIndexOf("#")) === "#/orgprofile"){
				window.location.reload();
			}else{		
				window.location.href = "#/orgprofile";
			}
		}else{
			sessionStorage.clear();
			navigate('/'); 
		}
	}

	useEffect(() => {
		getProfilePic();
	}, [])

	useEffect(() => {
		getProfilePic();
	}, [props.resetPic])

   return(
      <div className="StudentTopBar">
    	<AppBar variant='outlined' className={(sessionStorage.getItem("theme") === 'light') ? 'whiteBar' : ''} position="static">
		<Container maxWidth="l">
			<div className='putTitleLeft'><b className="exploreTitle">{props.title}</b></div>

			<Toolbar disableGutters sx={{ justifyContent: 'right' }}>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

          </Box>

          <Box sx={{ flexGrow: 0, mr: 3 }}>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={"First" + " " +"Last"} src={(picName !== null) ? picName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleButtonClick(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      </div>
   );
};

export default OrgTopBar;
