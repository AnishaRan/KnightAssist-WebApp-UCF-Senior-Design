import { useState, useEffect } from 'react';
import Header from '../OrgEvents/Header';
import './OrgProfile.css';
import OrgTopBar from '../OrgHome/OrgTopBar';
import Card from '@mui/material/Card';
import { Button, Typography, CardContent, TextField, Grid } from '@mui/material';
import { buildPath } from '../../path';
import NavTabs from './NavTabs';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { BiGlobe } from 'react-icons/bi';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import MapContainer from '../MapContainer/MapContainer';

function Contact(props) {
  
	const [newEmail, setNewEmail] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [newWebsite, setNewWebsite] = useState("");
	const [newLocation, setNewLocation] = useState("");
	const [newHours, setNewHours] = useState(undefined);

	const [map, setMap] = useState(undefined);

	const [mondayStart, setMondayStart] = useState(undefined);
	const [tuesdayStart, setTuesdayStart] = useState(undefined);
	const [wednesdayStart, setWednesdayStart] = useState(undefined);
	const [thursdayStart, setThursdayStart] = useState(undefined);
	const [fridayStart, setFridayStart] = useState(undefined);
	const [saturdayStart, setSaturdayStart] = useState(undefined);
	const [sundayStart, setSundayStart] = useState(undefined);
	const [mondayEnd, setMondayEnd] = useState(undefined);
	const [tuesdayEnd, setTuesdayEnd] = useState(undefined);
	const [wednesdayEnd, setWednesdayEnd] = useState(undefined);
	const [thursdayEnd, setThursdayEnd] = useState(undefined);
	const [fridayEnd, setFridayEnd] = useState(undefined);
	const [saturdayEnd, setSaturdayEnd] = useState(undefined);
	const [sundayEnd, setSundayEnd] = useState(undefined);

	const [daysArr, setDaysArr] = useState([]);

	async function getMap(address){
		try{
			const url = buildPath(`api/mapsAPI?address=${address}`);

			const response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let res = JSON.parse(await response.text());
	
			if(res['lat'] && res['lng']){
				setMap(<MapContainer title={address} lat={res['lat']} lng={res['lng']}/>)
			}else{
				setMap(undefined);
			}
		}catch(e){
			console.log(e);
		}
	}

	useEffect(() => {
		if(props.editMode){
			// So it refreshes to the right location
			// once set
			setMap(undefined);
			
			setNewEmail(props.org.email);
			props.editInfo.current.email = props.org.email;
			if(props.org.contact){
				setNewPhone(props.org.contact.phone);
				props.editInfo.current.phone = props.org.contact.phone;
				setNewWebsite(props.org.contact.website);
				props.editInfo.current.website = props.org.contact.website;
			}

			setNewLocation(props.org.location);
			props.editInfo.current.location = props.org.location;

			setNewHours(props.org.workingHoursPerWeek);
			props.editInfo.current.hours = props.org.workingHoursPerWeek;
		}
	}, [props.editMode])

	useEffect(() => {
		if(newHours){
			if(newHours.sunday){
				setSundayStart(newHours.sunday.start);
				setSundayEnd(newHours.sunday.end);
			}
			if(newHours.monday){
				setMondayStart(newHours.monday.start);
				setMondayEnd(newHours.monday.end);
			}
			if(newHours.tuesday){
				setTuesdayStart(newHours.tuesday.start);
				setTuesdayEnd(newHours.tuesday.end);
			}
			if(newHours.wednesday){
				setWednesdayStart(newHours.wednesday.start);
				setWednesdayEnd(newHours.wednesday.end);
			}
			if(newHours.thursday){
				setThursdayStart(newHours.thursday.start);
				setThursdayEnd(newHours.thursday.end);
			}
			if(newHours.friday){
				setFridayStart(newHours.friday.start);
				setFridayEnd(newHours.friday.end);
			}
			if(newHours.saturday){
				setSaturdayStart(newHours.saturday.start);
				setSaturdayEnd(newHours.saturday.end);
			}
		}
	}, [newHours])

	useEffect(() => {
		if(props.org){
			getMap(props.org.location);

			if(props.org.workingHoursPerWeek){
				const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
				const days = [];
	
				for(let name of dayNames){
					if(name in props.org.workingHoursPerWeek && props.org.workingHoursPerWeek[name].start 
					  && props.org.workingHoursPerWeek[name].end){
						days.push([name, props.org.workingHoursPerWeek[name].start, props.org.workingHoursPerWeek[name].end]);
					}else{
						days.push([name, "No Office Hours"]);
					}
				}
		
				console.log(days);
				setDaysArr(days);
			}
		}
	}, [props.org])

	function TimeSelector(props){
        return (
            <Grid sx={{marginLeft: 1, marginRight: 1, marginBottom: 1, width: 150}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
					<TimePicker label={props.label} value={(props.value) ? dayjs(props.value) : undefined} onChange={props.onChange}/>
                </LocalizationProvider>                                      
            </Grid>      
        )
    }

	return (
		<div>
			<div className='contactBox'>
				<div className='navSubTitle'>Contact</div>
				{(props.org.email) ? 
					<div className='profileEmail'>
						<MailOutlineIcon/>
						<div className='navContactText'>
							{(props.editMode) 
								?
									<TextField variant="standard" label="Email" required={false} value={newEmail} onChange={(e) => {setNewEmail(e.target.value); props.editInfo.current.email = e.target.value;}}/>
								:
									<a href='mailto:organizationemail@email.org'>{props.org.email}</a>
							}
						</div>
					</div>
					: ""
				}
				{props.org.contact && props.org.contact.phone ?
					<div className='profileEmail'>
						<PhoneIcon/>
						<div className='navContactText'>
							{(props.editMode) 
								?
									<TextField variant="standard" label="Phone Number" required={false} value={newPhone} onChange={(e) => {setNewPhone(e.target.value); props.editInfo.current.phone = e.target.value;}}/>
								:
									props.org.contact.phone
							}
						</div>
					</div>
					: ""
				}
				{props.org.contact && props.org.contact.website ?
					<div className='profileEmail'>
						<div className='websiteSize'>
							<BiGlobe/>
						</div>
						<div className='navContactText'>
							{(props.editMode)
								?
									<TextField variant="standard" label="Website" required={false} value={newWebsite} onChange={(e) => {setNewWebsite(e.target.value); props.editInfo.current.website = e.target.value;}}/>
								:
									props.org.contact.website
							}
						</div>
					</div>
					: ""
				}
				
				{props.org.location || props.org.workingHoursPerWeek ? <div className='navSubTitleOH'>Office Hours</div> : null}
				{props.org.location ?
					<div className='profileEmail'>
						<PlaceIcon/>
						<div className='navContactText'>
							{(props.editMode)
								?
									<TextField variant="standard" label="Location" required={false} value={newLocation} onChange={(e) => {setNewLocation(e.target.value); props.editInfo.current.location = e.target.value;}}/>
								:
									props.org.location
							}
						</div>
					</div>
					: ""
				}

				{(map && !props.editMode) ? 
					<Grid container marginLeft={"50px"} marginTop={"10px"} marginBottom={"20px"}>
						{map}
					</Grid>
					: null
				}


				{props.org.workingHoursPerWeek ?
					<div className='profileEmail'>
						<div className='navContactText'>
							{(props.editMode)
								?
									<Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Sunday:</p>
											{TimeSelector({label: "Start", value: sundayStart, onChange:(e) => {setSundayStart(e); if(!props.editInfo.current.hours.sunday) props.editInfo.current.hours.sunday = {}; props.editInfo.current.hours.sunday.start = e; console.log(e)}})}
											{TimeSelector({label: "End", value: sundayEnd, onChange:(e) => {setSundayEnd(e); if(!props.editInfo.current.hours.sunday) props.editInfo.current.hours.sunday = {}; props.editInfo.current.hours.sunday.start = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Monday:</p>
											{TimeSelector({label: "Start", value: mondayStart, onChange:(e) => {setMondayStart(e); if(!props.editInfo.current.hours.monday) props.editInfo.current.hours.monday = {}; props.editInfo.current.hours.monday.start = e;}})}
											{TimeSelector({label: "End", value: mondayEnd, onChange:(e) => {setMondayEnd(e); if(!props.editInfo.current.hours.monday) props.editInfo.current.hours.monday = {}; props.editInfo.current.hours.monday.end = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Tuesday:</p>
											{TimeSelector({label: "Start", value: tuesdayStart, onChange:(e) => {setTuesdayStart(e); if(!props.editInfo.current.hours.tuesday) props.editInfo.current.hours.tuesday = {}; props.editInfo.current.hours.tuesday.start = e;}})}
											{TimeSelector({label: "End", value: tuesdayEnd, onChange:(e) => {setTuesdayEnd(e); if(!props.editInfo.current.hours.tuesday) props.editInfo.current.hours.tuesday = {}; props.editInfo.current.hours.tuesday.end = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Wednesday:</p>
											{TimeSelector({label: "Start", value: wednesdayStart, onChange:(e) => {setWednesdayStart(e); if(!props.editInfo.current.hours.wednesday) props.editInfo.current.hours.wednesday = {}; props.editInfo.current.hours.wednesday.start = e;}})}
											{TimeSelector({label: "End", value: wednesdayEnd, onChange:(e) => {setWednesdayEnd(e); if(!props.editInfo.current.hours.wednesday) props.editInfo.current.hours.wednesday = {}; props.editInfo.current.hours.wednesday.end = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Thursday:</p>
											{TimeSelector({label: "Start", value: thursdayStart, onChange:(e) => {setThursdayStart(e); if(!props.editInfo.current.hours.thursday) props.editInfo.current.hours.thursday = {}; props.editInfo.current.hours.thursday.start = e;}})}
											{TimeSelector({label: "End", value: thursdayEnd, onChange:(e) => {setThursdayEnd(e); if(!props.editInfo.current.hours.thursday) props.editInfo.current.hours.thursday = {}; props.editInfo.current.hours.thursday.end = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Friday:</p>
											{TimeSelector({label: "Start", value: fridayStart, onChange:(e) => {setFridayStart(e); if(!props.editInfo.current.hours.friday) props.editInfo.current.hours.friday = {};  props.editInfo.current.hours.friday.start = e;}})}
											{TimeSelector({label: "End", value: fridayEnd, onChange:(e) => {setFridayEnd(e); if(!props.editInfo.current.hours.friday) props.editInfo.current.hours.friday = {}; props.editInfo.current.hours.friday.end = e;}})}
										</Grid>
										<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
											<p className='dayText'>Saturday:</p>
											{TimeSelector({label: "Start", value: saturdayStart ,onChange:(e) => {setSaturdayStart(e); if(!props.editInfo.current.hours.saturday) props.editInfo.current.hours.saturday = {}; props.editInfo.current.hours.saturday.start = e;}})}
											{TimeSelector({label: "End", value: saturdayEnd, onChange:(e) => {setSaturdayEnd(e); if(!props.editInfo.current.hours.saturday) props.editInfo.current.hours.saturday = {}; props.editInfo.current.hours.saturday.end = e;}})}
										</Grid>
									</Grid>
								:
									daysArr.map(day => (day[1] !== "No Office Hours") ? <div><b>{(day[0].substring(0, 1).toUpperCase() + day[0].substring(1) + ": ")}</b> {new Date(day[1]).toLocaleTimeString([], {timeStyle: 'short'}) + "-" + new Date(day[2]).toLocaleTimeString([], {timeStyle: 'short'})}</div> : <div><b>{(day[0].substring(0, 1).toUpperCase() + day[0].substring(1) + ": ")}</b>No Office Hours</div>)	
							}
						</div>
					</div>
					: ""
				}

			</div>
		
		</div>
	);
}

export default Contact;
