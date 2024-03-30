import React, { useState, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import { buildPath } from '../../path';
import Pagination from '@mui/material/Pagination';
import Header from '../StudentHome/StudentHeader.js';
import '../Header.css';
import Avatar from '@mui/material/Avatar';
import { List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';
import {Button} from '@mui/material';
import EventModal from '../StudentExplore/EventModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StudentHistory.css'
import StudentTopBar from '../TopBar/StudentTopBar';

function StudentHistory()
{

	const [eventHistories, setEventHistories] = useState(undefined);
	const [shownHistories, setShownHistories] = useState(undefined);
    const [numPages, setNumPages] = useState(0);  
    const [page, setPage] = useState(1);

	const [eventID, setEventID] = useState(undefined);
	const [openModal, setOpenModal] = useState(false);

	// Max number of event histories per page
	const [amtPerPage, setAmtPerPage] = useState(5);

	function setUpModal(id){
		setEventID(id);
		setOpenModal(true);
	}

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

    async function changePage(e, value){
        setPage(value);

		const histories = eventHistories.slice(amtPerPage * (value - 1), amtPerPage * (value - 1) + amtPerPage);
		
		for(let i = 0; i < histories.length; i++){
			const history = histories[i];

			const url = buildPath(`api/retrieveImage?typeOfImage=1&id=${history.ID}`);

			const response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let pic =  JSON.parse(await response.text());

			histories[i] =  <div>
							<ListItem>
								<Grid container layout={'row'} className='listsItems'>
									<Grid item>
										<Avatar
											src={pic.url}
											className="eventPic"
										/>
									</Grid>
									<Grid item sm={4}>
										<ListItemText className='historyDetails' primary={<span style={{ whiteSpace: 'pre-wrap' }}>
																{history.name + " (" + history.org + ")"}
															</span>} 						
														secondary={<span style={{ whiteSpace: 'pre-wrap' }}>
														{"Check In: " + history.checkIn[0] + " at " + history.checkIn[1] 
														+ "\nCheck Out: " + history.checkOut[0] + " at " + history.checkOut[1] + "\nHours Accumulated:"} <span className='hoursColor'>+{hourString(history.hours)} {((history.wasAdjusted) ? " (Adjusted)" : "")}</span>
															</span>}
										/>
									</Grid>
									<Grid item>
										<Button sx={{ mt: 4, ml:6, width: 150, color: "white", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => setUpModal(history.ID)}>Event Info</Button>
									</Grid>
								</Grid>
							</ListItem>
							<Divider sx={{width: "96%", background: (sessionStorage.getItem("theme") === 'light') ? 'black' : 'white'}}/>
						</div>
		}

		setShownHistories(histories);
	}

	async function getHistory(){ 
		try {
		   
			let url = buildPath(`api/historyOfEvents_User?studentId=${sessionStorage.getItem("ID")}`);

			let response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
		
			let res = JSON.parse(await response.text());

			// Sort by time if date is equal, date otherwise
			res.sort(function(a, b) {
				return Date.parse(a.checkIn[0] + " " + a.checkIn[1]) - Date.parse(b.checkIn[0] + " " + b.checkIn[1]);
			});

			setEventHistories(res.reverse());
			setNumPages(Math.ceil(res.length / amtPerPage));

			const histories = res.slice(0, amtPerPage);

			console.log(histories);

			for(let i = 0; i < histories.length; i++){
				const history = histories[i];

				url = buildPath(`api/retrieveImage?typeOfImage=1&id=${history.ID}`);

				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let pic =  JSON.parse(await response.text());

				histories[i] =  <div>
								<ListItem>
									<Grid container layout={'row'} className='listsItems'>
										<Grid item sm={1}>
											<Avatar
												src={pic.url}
												className="eventPic"
											/>
										</Grid>
										<Grid item sm={4}>
											<ListItemText className='historyDetails' primary={<span style={{ whiteSpace: 'pre-wrap' }}>
																	{(history.name + " (" + history.org + ")").length > 57 ? 
																		(history.name + " (" + history.org + ")").substring(0, 58) + "..." :
																		(history.name + " (" + history.org + ")")}
																</span>} 						
														secondary={<span style={{ whiteSpace: 'pre-wrap' }}>
															{"Check In: " + history.checkIn[0] + " at " + history.checkIn[1] 
															+ "\nCheck Out: " + history.checkOut[0] + " at " + history.checkOut[1] + "\nHours Accumulated:"} <span className='hoursColor'>+{hourString(history.hours)} {((history.wasAdjusted) ? " (Adjusted)" : "")}</span>
																</span>}
											/>
										</Grid>
										<Grid item>
											<Button sx={{ mt: 4, ml:6, width: 150, color: "White", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => setUpModal(history.ID)}>Event Info</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider sx={{width: "96%", background: (sessionStorage.getItem("theme") === 'light') ? 'black' : 'white'}}/>
							</div>
			}


			setShownHistories(histories);

		} catch (e) {
			console.log(e);
		}  
	}

	useEffect(() => {
		setAmtPerPage(5);
		getHistory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    return(
      <div className='spartan'>
		<Header/>
		<StudentTopBar title="History"/>
		<div className='moveEverything'>
			{(eventHistories) ?
					<div>
						<List component="nav" aria-label="mailbox folders">
							{shownHistories}
						</List>
						<Box my={2} display="flex" justifyContent="center">
							<Pagination className="historyPagination" page={page} count={numPages} onChange={changePage} shape="rounded"/>
						</Box>
						<EventModal eventID={eventID} setEventID={setEventID} open={openModal} setOpen={setOpenModal} shape="rounded"/>
					</div>
				: <div className='historyProgress'><CircularProgress/></div>
			}
		</div>
      </div>
    );
};

export default StudentHistory;
