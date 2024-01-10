import { useState, useEffect } from 'react';
import Header from '../OrgEvents/Header';
import './OrgProfile.css';
import OrgTopBar from '../OrgHome/OrgTopBar';
import Card from '@mui/material/Card';
import { Button, Typography, CardContent } from '@mui/material';
import { buildPath } from '../../path';
import NavTabs from './NavTabs';

function OrgProfile() {
  

  return (
    <div>
        <OrgTopBar />
        <div className='orgProfilePage'>
            <Header />
            <div className='orgProfileTitle'>Organization Profile</div>
            <NavTabs/>
        </div>
      
    </div>
  );
}

export default OrgProfile;
