import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Grid, Typography, Button, Box, Card, CardMedia, CardContent } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
// import Lottie, {LottieRefCurrentProps} from "lottie-react";
// import animationData from './landingAnimation2';
// import useStyles from '../PreLoginStyles';
import './AboutUs.css';
import PreLoginNavBar from '../../PreLogin/PreLoginNavBar';
import Team from './Team';
import Lottie from "lottie-react";
import animationData from './aboutUsAnimation';
import Footer from '../Footer';

const theme = createTheme();

function AboutUs()
{
    return(
		<ThemeProvider theme={theme}>
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center'}}>
				<PreLoginNavBar />
				<Typography component="h1" variant="h3" fontWeight={700} sx={{ color: '#212121', marginTop: 10, marginBottom: 1}}>
					About Us
				</Typography>
				<Grid container sx={{ marginX: '3%', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
					<Grid item md={2} sx={{ alignItems: 'center', justifyContent: 'center'}}>
						<Lottie animationData={animationData} />
					</Grid>
					<Grid item xs={12} md={6} align="left" sx={{}}>
						<Typography component="h6" variant="h6" align="left" sx={{ marginX: 5, color: '#212121' }}>
							KnightAssist is on a mission to improve how universities manage volunteering processes, offering a secure and user-centric digital platform to simplify authentication, 
							legitimacy verification, and the collection of volunteer hours, eliminating tedious administrative tasks and paperwork. KnightAssist is made by students and for students,
							our vision is to enhance the university experience by fostering community, civic engagement, skill development, and well-being among students, while also connecting them
							with campus organizations seeking volunteers. KnightAssist streamlines the volunteering experience for students, organizations, and university administrators, powered by new approaches and
							a robust technology stack. With KnightAssist we hope to create a more connected and engaged university community.
						</Typography>
					</Grid>
				</Grid>
				<Box sx={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(to right, #F5FAF9, #E4D9FB)', minWidth: '100%', justifyContent: 'center', alignItems: 'center'}}>
					<Team />
				</Box>
				<Footer />
			</Box>
		  </ThemeProvider>
    );
};

export default AboutUs;
