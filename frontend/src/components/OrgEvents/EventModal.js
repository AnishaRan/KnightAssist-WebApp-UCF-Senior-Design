import { Alert, Divider, Modal } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import './OrgEvents';
import { buildPath } from '../../path';
import { useEffect, useState } from 'react';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import QRCodeModal from './QRCodeModal';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MapContainer from '../MapContainer/MapContainer';

function EventModal(props)
{
    const handleCloseModal = () => {props.setOpen(false); props.setEventID(undefined);}
    const handleCloseAlert = () => {setOpenAlert(false);}
	const handleCloseHours = () => {setOpenEditHours(false); setShowError(false)};

    const [openAlert, setOpenAlert] = useState(false);
	const [openEditHours, setOpenEditHours] = useState(false);
    const [openVolunteers, setOpenVolunteers] = useState(false);

    const [name, setName] = useState("");
	const [orgName, setOrgName] = useState("");
	const [orgPic, setOrgPic] = useState(undefined);
	const [orgID, setOrgID] = useState(undefined);
    const [description, setDescription] = useState("");
    const [picLink, setPicLink] = useState(null);
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [curVolunteers, setCurVolunteers] = useState(0);
	const [studentPics, setStudentPics] = useState([]);
	const [map, setMap] = useState(undefined);

	const [formattedDate, setFormattedDate] = useState(undefined);

	// For volunteers that checkedin/out of the event
	const [attendedVolunteers, setAttendedVolunteers] = useState(0);
    const [maxVolunteers, setMaxVolunteers] = useState(0);
    const [volunteerInfo, setVolunteerInfo] = useState([]);
    const [tags, setTags] = useState([]);
	const [showTags, setShowTags] = useState(false);

	// For editing a volunteer's hours for an event
	const [curVolunteerID, setCurVolunteerID] = useState(undefined);
	const [newCheckInTime, setNewCheckInTime] = useState(undefined);
	const [newCheckOutTime, setNewCheckOutTime] = useState(undefined);
	const [showError, setShowError] = useState(false);

	const [hasEndDate, sethasEndDate] = useState(false);

	const [isPast, setIsPast] = useState(false);

	// If the event has started, you can generateACode
	const [generateCheckIn, setGenerateCheckIn] = useState(false);
	const [generateCheckOut, setGenerateCheckOut] = useState(false);
	const [openQRModal, setOpenQRModal] = useState(false);
	const [checkType, setCheckType] = useState(undefined);

	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September",
					"October", "November", "December"];

	// The file for the attendee data
	const [excelFileLink, setExcelFileLink] = useState(undefined);
 
	// Event has not happened yet or is not over
    function eventIsUpcoming(endTime){
        return new Date().toISOString().localeCompare(endTime) < 0;
	}

	// Can show the check in button if the event has not
	// ended and it is the same day or the event has started
	function canShowCheckIn(start, end){
		let startDay = String(start);
        startDay = startDay.substring(0, startDay.indexOf("T"));

        let today = new Date().toISOString();
        today = today.substring(0, today.indexOf("T"));
		
		// It is before the day the event starts
		if(startDay.localeCompare(today) > 0) return false;
		
		// It is before the event ends
		return new Date().toISOString().localeCompare(end) < 0;
	}

	// During the period of the event
	function canShowCheckOut(start, end){
		const date = new Date().toISOString();
		return date.localeCompare(start) > 0 && date.localeCompare(end) < 0;
	}

	function QROnClick(type){
		setCheckType(type);
		setOpenQRModal(true);
	}

	function openStudentPage(id){
		sessionStorage.setItem("viewingStudentPageID", id);
		window.location.href="/#/studentprofile";
	}

	function openOrgPage(id){
		if(id !== sessionStorage.getItem("ID"))
			sessionStorage.setItem("viewingPageID", id);
		window.location.href="/#/orgprofile";    
	}

    async function getVolunteerInfo(id){

        console.log(sessionStorage.getItem("token"))
        let url = buildPath(`api/userSearch?userID=${id}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            }        
        });
    
        let res = JSON.parse(await response.text());

        console.log(res);
        
        return {"name": res.firstName + " " + res.lastName, "profilePic": res.profilePic, "userID": res._id};
    }

    async function setInfo(){        
        let url = buildPath(`api/searchOneEvent?eventID=${props.eventID}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
    
        let res = JSON.parse(await response.text());

        let event = res[0];

        console.log(event);

        if(event) {
			setName(event.name);
			setDescription(event.description);
			setLocation(event.location);
			setStartTime(event.startTime);
			setEndTime(event.endTime);
			setCurVolunteers(event.registeredVolunteers.length)
			setMaxVolunteers(event.maxAttendees);
			setTags(event.eventTags);
			setShowTags(event.eventTags.length > 0);

			url = buildPath(`api/organizationSearch?organizationID=${event.sponsoringOrganization}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			let org = JSON.parse(await response.text());

			setOrgName(org.name);
			setOrgID(org._id);
			
			url = buildPath(`api/retrieveImage?typeOfImage=2&id=${event.sponsoringOrganization}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let orgPic = JSON.parse(await response.text());

			setOrgPic(orgPic.url);

			const startDay = dayjs(event.startTime);

			let dayStr = days[startDay.day()];

			dayStr += (", " + months[startDay.month()]);
			dayStr += (" " + startDay.date());

			const endDay = dayjs(event.endTime);

			// If the event goes on for more than a day,
			if(startDay.date() !== endDay.date()){
				sethasEndDate(true);

				dayStr += (" - " + (days[endDay.day()] + ", " + months[endDay.month()] + " " + endDay.date()));
			}else{
				sethasEndDate(false);
			}

			setFormattedDate(dayStr);

			url = buildPath(`api/retrieveImage?typeOfImage=1&id=${event._id}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let pic = JSON.parse(await response.text());

			setPicLink(pic.url);
			
			url = buildPath(`api/mapsAPI?address=${event.location}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let res = JSON.parse(await response.text());

			if(res['lat'] && res['lng']){
				setMap(<MapContainer title={res.location} lat={res['lat']} lng={res['lng']}/>)
			}else{
				setMap(undefined);
			}

			const volunteers = [];

			const pics = [];

			// It is a past event
			if(!eventIsUpcoming(event.endTime)){
				// Get students that came to event
				for(let student of event.checkedInStudents){
					volunteers.push(await getVolunteerInfo(student.studentId));
					pics.push(await getStudentPic(student.studentId))
				}
				
				url = buildPath(`api/exportAttendeesCSV?eventId=${event._id}`);

				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});

				let link = await response.blob();
				console.log(link)

				setExcelFileLink(link);
			}else{
				// Get students that have RSVP'd
				for(let id of event.registeredVolunteers){
					volunteers.push(await getVolunteerInfo(id));
					pics.push(await getStudentPic(id));
				}
			}

			setAttendedVolunteers(event.checkedInStudents.length);
			setVolunteerInfo(volunteers);

			setStudentPics(pics);

			console.log(pics);

			setGenerateCheckIn(canShowCheckIn(event.startTime, event.endTime));
			setGenerateCheckOut(canShowCheckOut(event.startTime, event.endTime));

			setIsPast(!eventIsUpcoming(event.endTime));

			setOpenVolunteers(false);
        } else {
            console.log("Event undefined or not found");
        }   
    }

	async function getStudentTimes(info){
		console.log(info);

		try {
		   
			let url = buildPath(`api/historyOfSingleEvent_User?studentId=${info.userID}&eventId=${props.eventID}`);

			let response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
		
			let hoursInfo = JSON.parse(await response.text());

			console.log(hoursInfo);

			setCurVolunteerID(info.userID);
			setNewCheckInTime(hoursInfo.checkInTime);
			setNewCheckOutTime(hoursInfo.checkOutTime);
		} catch (e) {
			console.log(e);
		}  
	}

	async function getStudentPic(id){
		try{
			const url = buildPath(`api/retrieveImage?id=${id}&typeOfImage=3`);

			const response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let pic = JSON.parse(await response.text());

			return pic.url;
		}catch(e){
			console.log(e);
		}
	}

	// Check in isn't after check out
	function validTime(startTime, endTime){
		return new Date(startTime) < new Date(endTime);
	}

    function validInput(){
		if(!validTime(newCheckInTime, newCheckOutTime)){
			setShowError(true);
			return false;
		}
		
        return true;
    }

	async function saveHours(){
		if(!validInput()) return;

		try{
			const json = {
				eventID: props.eventID,
				studentID: curVolunteerID,
				newCheckIn: newCheckInTime,
				newCheckOut: newCheckOutTime,
				whoAdjustedTime: "organization"
			};
	
			console.log(json);
	
			let url = buildPath("api/editEventTotalHours");
	
			const response = await fetch(url, {
				method: "POST",
				body: JSON.stringify(json),
				headers: {"Content-Type": "application/json"},
			});
	
			let res = JSON.parse(await response.text());
			console.log(res);

			handleCloseHours();
		}catch(e){
			console.log(e);
		}
	}

    function EventName(){
        return (
            <div className='bigName'>
                {name}
            </div>
        )
    }

	function OrgName(){
		return (
			<Grid container direction="row" sx={{ marginLeft: 2, marginBottom: 3, textAlign: "left"}}><Avatar className="orgPicModal" src={orgPic}/><a className='orgNameModal' style={{color: (sessionStorage.getItem("theme") === "light") ? "black" : "white"}} onClick={() => openOrgPage(orgID)}><b>{orgName}</b></a></Grid>
		)
	}

    function Description(){
        return (
            <div className='description'>
                {description}
            </div>
        )
    }

    function GridIcon(props){
        return (
            <Grid item xs={1}>
                {props.icon}                                 
            </Grid>    
        )
    }

    function GridInfo(props){
        return (
            <Grid item xs={0}>
                {props.info}                             
            </Grid>   
        ) 
    }

	function TimeSelector(props){
        return (
            <Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateTimePicker label={props.label} value={dayjs(props.value)} onChange={props.onChange}/>
                </LocalizationProvider>                                      
            </Grid>      
        )
    }

    function VolunteerItem(props){
        return (
			<div className='addFL'>
			    <ListItemButton className='volunteerItem' onClick={() => openStudentPage(props.info.userID)}>
					<Avatar
						src={studentPics[props.i]}
						className="volunteerPic"
					/>
					<ListItemText className="volunteerName" primary={props.info.name} />
          	   </ListItemButton>
			</div>
        )
    }


    function Volunteers(){
        let className = (sessionStorage.getItem("theme") === 'light') ? 'volunteerList' : 'volunteerListDark';
        return (
            <div className='volSpace'>
                <button className="volunteersBtn" onClick={() => {if((curVolunteers > 0 && !isPast) || attendedVolunteers > 0 ) setOpenVolunteers(!openVolunteers)}}>
                    <p className={'volunteerSpaceOrg'}><i>{(isPast) ? ("Volunteers: " + attendedVolunteers) : "Registered Volunteers:"} {(!isPast) ? curVolunteers + "/" + maxVolunteers : null}</i></p> 
                </button>

                <Collapse in={openVolunteers} timeout="auto" unmountOnExit>
                    <List className='volRound' component="button" disablePadding>
                        {volunteerInfo.map((info, i) => <div><VolunteerItem info={info} i={i}/>
							{(isPast) ? <Button sx={{ mt: 1, mr: 0.5, mb: 0.5, width: 125, color: 'white', backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" 
												onClick={() => {getStudentTimes(info); setOpenEditHours(true)}}>Edit Hours</Button> : null}
							{(i !== (volunteerInfo.length - 1)) ? <Divider sx={{width: "100%", background: "black"}}/> : null}</div>)}
                    </List>
                </Collapse>
           </div>
        )
    }

    function Tag(props){
        return (
            <Grid item>
                <Card className='eventInterest'>
                    {props.tag}
                </Card>
            </Grid>
        )
    }

    function Tags(){
        return (
			<Grid marginTop={"20px"} marginBottom={"55px"}>
				{tags.map(t => <Tag tag={t}/>)}
			</Grid>
        )
    }

	function ErrorMessage(){
        return (
            <div>
                {(showError) === true
                    ?
                        <div className='addAlertSpace'>
                            <Alert severity="error">Check-in after check-out</Alert>					
                        </div>
                    :
                        null
                }
            </div>
        )
    }

    function edit(){
        //handleCloseModal();
        props.setEditMode(1);
        props.setOpenAdd(true);
    }

    async function deleteEvent(){
        const organizationID = sessionStorage.getItem("ID");

        const json = {
            eventID: props.eventID,
            organizationID: organizationID
        };

        console.log(json);

        let url = buildPath(`api/deleteSingleEvent`);

        let response = await fetch(url, {
            method: "DELETE",
            body: JSON.stringify(json),
            headers: {"Content-Type": "application/json"},
        });
    
        let res = await response.text();

        console.log(res);

        if(eventIsUpcoming(endTime))
            props.setReset(props.reset * -1);
        else
            props.setResetPast(props.resetPast * -1);  

        props.setResetSearch(props.resetSearch * -1);
    
        handleCloseAlert();
        handleCloseModal();
    }

    // For when edit finishes, so the most recently
    // open event's changes are reflected
    useEffect(()=>{
        if(props.eventID !== undefined)
            setInfo();

		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.editMode])
    
    useEffect(()=>{
        if(props.eventID !== undefined)
        	setInfo();
	
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.eventID])

    return(
        <Modal sx={{display:'flex', alignItems:'center', justifyContent:'center'}} open={props.open} onClose={handleCloseModal}>
                <Card className='eventModalCard center spartan'>
					<img className='boxImg' src={picLink} alt=""></img>
					<Container>
						<Box sx={{justifyContent:'center'}}>
							<EventName/>

							<OrgName/>

							<Grid container sx={{justifyContent:'left', textAlign: "left", whiteSpace: 'pre-wrap' }} marginTop={"30px"} marginLeft={"20px"} marginBottom={"20px"}>
								<Grid item width={"40%"}>
									<div className='anIcon'>
										<Tooltip title="Date" placement="top">
											<div>
												<GridIcon icon={<EventIcon/>}/>
											</div>
										</Tooltip>
									</div>
									<GridInfo info={formattedDate}/>
								</Grid>                 

								<Grid item width={"60%"}>
									<div className='anIcon'>
										<Tooltip title="Location" placement="top">
											<div>
												<GridIcon icon={<PlaceIcon/>}/>
											</div>
										</Tooltip>
									</div>
									<GridInfo info={location}/>
								</Grid>
							</Grid>

							<Grid container sx={{justifyContent:'left', textAlign: "left"}} marginLeft={"20px"} marginBottom={"30px"}>
								<Grid item width={"15%"}>
									<div className='anIcon'>
										<Tooltip title="Start Time" placement="bottom">
											<div>
												<GridIcon icon={<PlayArrowIcon/>}/>
											</div>
										</Tooltip>
									</div>
									<GridInfo info={dayjs(startTime).format('hh:mm a')}/>
								</Grid>

								<Grid item width={"15%"}>
									<div className='anIcon'>
										<Tooltip title="End Time" placement="bottom">
											<div>
												<GridIcon icon={<StopIcon/>}/>
											</div>
										</Tooltip>
									</div>
									<GridInfo info={dayjs(endTime).format('hh:mm a')}/>
								</Grid>
							</Grid>

							<Description/>

							<Grid container marginLeft={"20px"} marginBottom={"10px"} marginTop={"20px"}>
								<Grid item width={"50%"} marginLeft={(map) ? "0%" : "30%"}>
									{(tags.length > 0) ? <Tags/> : null}
									<Grid marginTop={"40%"} width={"50%"}>
										<Volunteers/>
									</Grid>
								</Grid>

								<Grid item width={(map) ? "50%" : "0"}>
									{(map) ? 
										<Grid container>
											{map}
										</Grid>
										: null
									}
								</Grid>
							</Grid>		

							{(!isPast) ? 
								<Grid container sx={{justifyContent:'center'}} marginTop={"8%"}>
									<Grid item marginRight={"2%"}>
										<Button disabled={!generateCheckIn} sx={{ mt: 3, width: 200, color: ((sessionStorage.getItem("theme") === "light") ? "white" : "black"), backgroundColor: ((sessionStorage.getItem("theme") === "light") ? "black" : "white"), "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => QROnClick("In")}>Generate Check-In Code</Button>
									</Grid>
									<Grid item marginLeft={"2%"}>
										<Button disabled={!generateCheckOut} sx={{ mt: 3,  width: 200, color: ((sessionStorage.getItem("theme") === "light") ? "white" : "black"), backgroundColor: ((sessionStorage.getItem("theme") === "light") ? "black" : "white"), "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => QROnClick("Out")}>Generate Check-Out Code</Button>
									</Grid>
								</Grid>   
								: 
								<Grid container sx={{justifyContent:'center'}} marginTop={"8%"} marginLeft={"1%"}>
									<Grid item xs={12}>
										{(attendedVolunteers > 0) ? <a href={(excelFileLink) ? URL.createObjectURL(excelFileLink) : null} download={name + " Attendee Data.xlsx"} target="_blank" rel="noreferrer"><Button sx={{ mt: 3, width: 300, color: ((sessionStorage.getItem("theme") === "light") ? "white" : "black"), backgroundColor: ((sessionStorage.getItem("theme") === "light") ? "black" : "white"), "&:hover": {backgroundColor: "#7566b4"}}} variant="contained">Download Attendee Data</Button></a> : null}
									</Grid>
								</Grid>   
							}
	
							<Grid container marginLeft={"30%"} marginTop={"50px"} marginBottom={"30px"}>
								<Grid item xs={3}>
									<Tooltip title="Edit" placement="top">
										<button className='editEventBtn' style={{color: ((sessionStorage.getItem("theme") === "light") ? "black" : "white")}} onClick={() => edit()}><EditIcon/></button>
									</Tooltip>
								</Grid>
								<Grid item xs={0}>
									<Tooltip title="Delete" placement="top">
										<button className='deleteEventBtn' style={{color: ((sessionStorage.getItem("theme") === "light") ? "black" : "white")}} onClick={() => setOpenAlert(true)}><DeleteForeverIcon/></button>
									</Tooltip>
								</Grid>
							</Grid>   

							<Dialog
								open={openAlert}
								onClose={handleCloseAlert}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
								>
									<DialogTitle id="alert-dialog-title">
									{"Delete Event?"}
									</DialogTitle>
									<DialogContent>
									<DialogContentText id="alert-dialog-description">
									Doing so will remove this event from all volunteer's past and future history. 
									</DialogContentText>
									</DialogContent>
									<DialogActions>
									<Button onClick={handleCloseAlert}>Undo</Button>
									<Button sx={{color:"red"}} onClick={() => deleteEvent()} autoFocus>Delete</Button>
									</DialogActions>
							</Dialog> 

							<Dialog open={openEditHours} onClose={handleCloseHours}>
								<DialogContent className='spartan hourModal'>
									<Grid container justifyContent="center" alignItems="center" layout={'row'}>
										<DialogTitle className='dialogTitle'>Edit Volunteer's Hours</DialogTitle>
									</Grid>
									<Grid container justifyContent="center" alignItems="center" layout={'row'} marginBottom={"20px"}>
										{TimeSelector({label:"Check In", value:newCheckInTime, onChange:(e) => setNewCheckInTime(e)})}  
									</Grid>
									<Grid container justifyContent="center" alignItems="center" layout={'row'}>
										{TimeSelector({label:"Check Out", value:newCheckOutTime, onChange:(e) => setNewCheckOutTime(e)})}  
									</Grid>
									<Grid container justifyContent="center" alignItems="center" layout={'row'}>
										<Button sx={{ mt: 5, width: 175, color: "white", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => {saveHours()}}>Save</Button>
									</Grid>
									<ErrorMessage/>
								</DialogContent>
							</Dialog>
						</Box>
					</Container>
					<QRCodeModal eventID={props.eventID} open={openQRModal} setOpen={setOpenQRModal} checkType={checkType} setCheckType={setCheckType}/>	
                </Card>

        </Modal>
    );
};

export default EventModal;
