import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StudentHome.css';
import { Typography, Avatar, CardHeader, Divider, List, ListItemButton, ListItemText, IconButton, Grid, CardMedia, Dialog, DialogTitle, Box, DialogActions, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StudentHeader from './StudentHeader';
import { buildPath } from '../../path';
import CircularProgress from '@mui/joy/CircularProgress';
import ListItem from '@mui/material/ListItem';
import StudentTopBar from '../TopBar/StudentTopBar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import StudentHomeTabs from './StudentHomeTabs.js';
import Calendar from './Calendar.js';

function StudentHome()
{
  const [open, setModalOpen] = useState(false);
  const [tabSelected, setTabSelected] = useState('Events');
  const [goal, setGoal] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [favOrgs, setFavOrgs] = useState([]);
  const [upcomingRSVPdEvents, setUpcomingRSVPdEvents] = useState([]);
  const [upcomingRSVPdEventsLength, setUpcomingRSVPdEventsLength] = useState(0);

	const updateUpcomingRSVPdEventsLength = (newValue) => {
		setUpcomingRSVPdEventsLength(newValue);
	};
    
	function hourString(totalHours){
		const hourStr = totalHours.toString();

		// It is a whole hour
		if(!hourStr.includes('.')) return hourStr + ":00";

		const hours = hourStr.substring(0, hourStr.indexOf("."));

		const noHours = hours === "";

		// Less than 10 minutes
		const leadingZero = Number(hourStr.substring(hourStr.indexOf(".") + 1)) < 17;

		const minutes = Math.round((Number(hourStr.substring(hourStr.indexOf(".") + 1)) / 100) * 60);

		return ((noHours) ? "0" : "") + hours + ":" + ((leadingZero) ? "0" : "") + minutes;
	}

    async function getStudentInfo() {
      const email = '';
      const url = buildPath(`api/userSearch?userID=${sessionStorage.getItem("ID")}`);
    
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        let res = JSON.parse(await response.text());
        console.log(res);

        fetchUpcomingEvents(res.eventsRSVP);
        setGoal(res.semesterVolunteerHourGoal);
        setTotalHours(hourString(res.totalVolunteerHours));
        setFavOrgs(res.favoritedOrganizations);
    
        
      } catch (error) {
        console.log("An error has occurred" + error);
      }
    }

    function eventIsUpcoming(endTime){
      return new Date().toISOString().localeCompare(endTime) < 0;
    }

    async function fetchUpcomingEvents(allEvents) {
      var upcomingRSVPEvents = [];
      try {
        for(const event of allEvents) {
          var url = buildPath(`api/searchOneEvent?eventID=${event}`);
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          let result = JSON.parse(await response.text());
          if (result.length > 0 && result[0].hasOwnProperty('endTime')) {
            if(eventIsUpcoming(result[0].endTime)) {
              upcomingRSVPEvents.push(result[0]);
            }
          }
        }
        setUpcomingRSVPdEvents(upcomingRSVPEvents);
        setUpcomingRSVPdEventsLength(upcomingRSVPEvents.length);
        console.log(upcomingRSVPEvents);
      } catch(e) {
        console.log("fetch upcoming events failed");
      }
    }
    
    

    const handleTabChange = (newValue) => {
      console.log(newValue);
      setTabSelected(newValue);
    };

    useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upcomingRSVPdEvents]);

	useEffect(() => {
		getStudentInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

   return(
    
      <div className='spartan' id='homePage'>
        <StudentHeader/>
        <StudentTopBar title="Home"/>
        <div className="studHomePage">
          
          <div className='card-row'>
          <Card variant='outlined' className='home-card' style={{ backgroundColor: '#EFF8FB' }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar aria-label="icon" style={{ backgroundColor: '#A4C5D0' }}><TimelapseIcon style={{ color: 'black' }}/></Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="black" style={{ textAlign: 'left' }}>Semester Goal</Typography>
                    <Typography variant="h5" style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>{goal} Hours</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card variant='outlined' className='home-card' style={{ backgroundColor: '#F2FFF5' }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar aria-label="icon" style={{ backgroundColor: '#A4D0AE' }}><TaskAltIcon style={{ color: 'black' }}/></Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="black" style={{ textAlign: 'left' }}>Total Hours</Typography>
                    <Typography variant="h5" style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>{totalHours} Hours</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card variant='outlined' className='home-card' style={{ backgroundColor: '#F5EFFF' }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar aria-label="icon" style={{ backgroundColor: '#B99EE6' }}><CalendarTodayIcon style={{ color: 'black' }}/></Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="black" style={{ textAlign: 'left' }}>Upcoming Events</Typography>
                    <Typography variant="h5" style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>{upcomingRSVPdEventsLength} RSVPs</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card variant='outlined' className='home-card' style={{ backgroundColor: '#FFE9E9' }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Avatar aria-label="icon" style={{ backgroundColor: '#F9AFAF' }}><FavoriteBorderIcon style={{ color: 'black' }}/></Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" color="black" style={{ textAlign: 'left' }}>Organizations</Typography>
                    <Typography variant="h5" style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>{favOrgs.length}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
          <StudentHomeTabs onTabChange={handleTabChange}/>
          {tabSelected === 'Events' && (
            <>
              <Calendar upcomingRSVPdEvents={upcomingRSVPdEvents} eventsLength={upcomingRSVPdEventsLength} updateEventsLength={updateUpcomingRSVPdEventsLength}/>
            </>
          )}
          {tabSelected === 'FavoritedOrgs' && (
            <>
              sd
            </>
          )}


        <Dialog open={open} onClose={() => setModalOpen(false)}>
          <DialogTitle>Are you sure you want to cancel your RSVP?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Yes</Button>
          </DialogActions>
        </Dialog>




        </div>
      </div>
   );
};

export default StudentHome;
