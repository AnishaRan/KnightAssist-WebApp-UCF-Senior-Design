import { useState, useEffect } from 'react';
import AddAnnouncementModal from './AddAnnouncementModal';
import Header from '../OrgEvents/Header';
import './OrgHome.css';
import NextEventCard from './NextEvent';
import OrgTopBar from './OrgTopBar';
import Feedback from './Feedback';
import StatCards from './StatCards';
import Analytics from './Analytics';
import Card from '@mui/material/Card';
import CloseIcon from '@mui/icons-material/Close';
import Chart from 'chart.js/auto';
import { Button, Typography, CardContent, Dialog, DialogContent, Grid, DialogTitle, Tooltip } from '@mui/material';
import { Bar } from "react-chartjs-2";
import { buildPath } from '../../path';

function OrgHome() {
	const [openAnnouncement, setOpenAnnouncement] = useState(false);
	const [orgName, setOrgName] = useState("");
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [numUpcomingEvents, setNumUpcomingEvents] = useState(0);
	const [chartData, setChartData] = useState(undefined);
	const [fullChartData, setFullChartData] = useState(undefined);
	const [hoverImage, setHoverImage] = useState(false);

	const [openChartModal, setOpenChartModal] = useState(false);

	const closeChartModal = () => {setOpenChartModal(false)};

	function eventIsUpcoming(endTime){
		return new Date().toISOString().localeCompare(endTime) < 0;
	}

	async function getUpcomingEvents() {
		const organizationID = sessionStorage.getItem("ID");

		try {
		let eventsUrl = buildPath(`api/searchEvent?organizationID=${organizationID}`);
		let eventsResponse = await fetch(eventsUrl, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		let eventsData = JSON.parse(await eventsResponse.text());

		const upcomingEvents = eventsData.filter((event) => eventIsUpcoming(event.endTime));

		upcomingEvents.sort(function(a,b){ 
            return a.startTime.localeCompare(b.startTime)
        });

		console.log("Upcoming Events:", upcomingEvents);
		setUpcomingEvents(upcomingEvents);
		setNumUpcomingEvents(upcomingEvents.length);

		} catch (error) {
		console.error("Error fetching upcoming events:", error);
		}
	}

	async function getOrgName(){
        let url = buildPath(`api/organizationSearch?organizationID=${sessionStorage.getItem("ID")}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
    
        let res = JSON.parse(await response.text());

        setOrgName(res.name);
    }

	async function getChartData() {
		const chartUrl = buildPath(`api/attendanceAnalytics?orgId=${sessionStorage.getItem("ID")}&limit=true`);
		try {
			const response = await fetch(chartUrl);
			const jsonData = await response.json();
			console.log(jsonData);
			setChartData(jsonData)
		} catch (error) {
			console.error('Error fetching chart data:', error);
		}
	}

  	async function openPopup(){
		const chartUrl = buildPath(`api/attendanceAnalytics?orgId=${sessionStorage.getItem("ID")}`);
		try {
			const response = await fetch(chartUrl);
			const jsonData = await response.json();
			console.log(jsonData);
			setFullChartData(jsonData);
			setOpenChartModal(true)
		} catch (error) {
			console.error('Error fetching chart data:', error);
		}
	}	

  useEffect(() => {
    getUpcomingEvents();
	getOrgName();
    getChartData();
  }, []);

  return (
    <div className='spartan'>
      <OrgTopBar title="Home"/>
      <Header />
      <div className='move'>
        <div className="orgPortalTop">
          <Card variant='contained' sx={{ marginRight: '5%' }}>
            <CardContent className='cardContent' sx={{ display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant="h5">
                Welcome, {orgName}
              </Typography>
              <Button variant="contained" sx={{color: 'white', backgroundColor: '#5B4E77'}} className="addEventBtn" onClick={() => setOpenAnnouncement(true)}>
                Add Announcement
              </Button>
              <AddAnnouncementModal open={openAnnouncement} setOpen={setOpenAnnouncement} />
            </CardContent>
          </Card>
        </div>
        <div className="orgHomeTopRow">
          <div className="nextEvent">
            <NextEventCard upcomingEvents={upcomingEvents[0]} />
          </div>
          <div className="feedback">
            <Feedback />
          </div>
        </div>
        <div className="orgHomeBottomRow">
            <StatCards />
			<div className={'defaultChart' + ((hoverImage) ? " blurChart" : "")} onClick={() => openPopup()} onMouseOver={() => setHoverImage(true)} onMouseLeave={() => setHoverImage(false)}>
				{(chartData) ? 
						<Bar
							type='bar'
							data={chartData.data}
							color={(sessionStorage.getItem("theme") === "light") ? "gray" : "white"}
							options={
								{
									color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
									scales: {
										y: {
											beginAtZero: true,
											title: {
												display: true,
												text: 'Number of Attendees',
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
												font: {
													size: 20,
												}
											},
											grid: {
												color: (sessionStorage.getItem("theme") === "light") ? "lightgray" : "gray"
											},
											ticks: {
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											}
										},
										x: {
											title: {
												display: true,
												text: 'Event Names',
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
												font: {
													size: 20
												}
											},
											grid: {
												color: (sessionStorage.getItem("theme") === "light") ? "lightgray" : "gray"
											},
											ticks: {
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											}
										}
									},
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										title: {
											display: true,
											text: 'Event Attendance Analysis',
											color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											font: {
												size: 25
											},
										},
										subtitle: {
											display: true,
											text: (hoverImage) ? '(Click anywhere to view all past event data)' : '           ',
											color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
										}
									}
								}
							}						
							/>
				: null}
			</div>
        </div>

		<Dialog maxWidth={"xl"} sx={{marginLeft: 10}} open={openChartModal} onClose={() => closeChartModal()}>
			<DialogContent className='spartan chartModal'>
				<button className='chartClose'>
					<CloseIcon onClick={() => closeChartModal()}/>
				</button>
				{(fullChartData) ? 
						<Bar
							type='bar'
							data={fullChartData.data}
							color={(sessionStorage.getItem("theme") === "light") ? "gray" : "white"}
							options={
								{
									color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
									scales: {
										y: {
											beginAtZero: true,
											title: {
												display: true,
												text: 'Number of Attendees',
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
												font: {
													size: 20,
												}
											},
											ticks:{
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											},
											grid: {
												color: (sessionStorage.getItem("theme") === "light") ? "lightgray" : "gray"
											}
										},
										x: {
											title: {
												display: true,
												text: 'Event Names',
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
												font: {
													size: 20
												},
											},
											ticks:{
												color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											},
											grid: {
												color: (sessionStorage.getItem("theme") === "light") ? "lightgray" : "gray"
											}
										}
									},
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										title: {
											display: true,
											text: 'Event Attendance Analysis',
											color: (sessionStorage.getItem("theme") === "light") ? "gray" : "white",
											font: {
												size: 25
											}
										}
									}
								}
							}
							className='addChartSpace'
						/> 
					: null}				
			</DialogContent>
		</Dialog>
      </div>
    </div>
  );
}

export default OrgHome;
