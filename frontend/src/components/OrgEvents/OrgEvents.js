import {useState, useRef, useEffect} from 'react';

import UpcomingEvents from './UpcomingEvents';
import PastEvents from './PastEvents';
import Search from './Search';
import AddEventModal from './AddEventModal';
import EventModal from './EventModal';
import SearchSwitch from './SearchSwitch';
import Header from './Header';
import './OrgEvents.css';
import SearchResults from './SearchResults';
import { Chip, Grid } from '@mui/material';
import OrgTopBar from '../OrgHome/OrgTopBar';

function OrgPortal()
{

    const [openModal, setOpenModal] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [editMode, setEditMode] = useState(0);
    const [eventID, setEventID] = useState(undefined);
    const [resetUpcoming, setResetUpcoming] = useState(1);
    const [resetPast, setResetPast] = useState(1);
    const [resetSearch, setResetSearch] = useState(1);
    const [searchType, setSearchType] = useState("events");

	const [searchMode, setSearchMode] = useState(false);
	const [resetSearchCards, setResetSearchCards] = useState(1);

	const [selectedType, setSelectedType] = useState("Upcoming");

	const results = useRef([]);
    
    function Title(){
      return(
        <div className='yourEvents spartan'>
           <h1>Events</h1>
        </div>
      )
    }

	function changeType(type){
		// If type = 0, upcoming, else past
		if(type === 0 && selectedType !== "Upcoming"){
			setSelectedType("Upcoming");
		}else if(type === 1 && selectedType !== "Past"){
			setSelectedType("Past");
		}
	}

	function EventTypeSwitch(){
		return (
			<div className='eventTypes'>
				<Chip
					label="Upcoming"
					className='largerChip tagChip'
					onClick={() => changeType(0)}
					sx={{backgroundColor: (selectedType === "Upcoming") ? "#5f5395" : "default", 
						color: (selectedType === "Upcoming") ? 'white' : 'black',
						"&:hover": {
						backgroundColor: (selectedType === "Upcoming") ? "purple" : "default"
					}}}
				/>
				<Chip
					label="Past"
					className='largerChip tagChip'
					onClick={() => changeType(1)}
					sx={{backgroundColor: (selectedType === "Past") ? "#5f5395" : "default", 
						color: (selectedType === "Past") ? 'white' : 'black',
						"&:hover": {
						backgroundColor: (selectedType === "Past") ? "purple" : "default"
					}}}
				/>
			</div>
		)
	}

    return(
     	<div className='spartan'>
			<Header/>
			<OrgTopBar/>
			<div className='move'>
				<div>
					<Grid container layout={'row'} width={"100%"} style={{ gap: "0 24px" }}>
						<Grid item>
							<Title/>
						</Grid>						
						<Grid item>
							<SearchSwitch setSearchType={setSearchType}/>
						</Grid>
						<Grid item>
							<Search results={results} searchType={searchType} resetEventSearch={resetSearch} setEventID={setEventID} setOpenEvent={setOpenEvent} searchMode={searchMode} resetSearchCards={resetSearchCards} setResetSearchCards={setResetSearchCards}/>
						</Grid>
						<Grid item>
							<button type="button" class="addEventBtn btn btn-primary" onClick={() => {setSearchMode(true); setResetSearchCards(resetSearchCards * -1)}}>Search</button>
						</Grid>
						<Grid item>
							{(searchMode) ? <button type="button" class="addEventBtn btn btn-primary" onClick={() => setSearchMode(false)}>Exit Search</button> : ""}
						</Grid>
					</Grid>
				</div>
				<Grid justifyContent="center" alignItems="center" style={{marginLeft: "40%", marginBottom: "3%"}}>
					{(!searchMode) ? <button type="button" class="addEventBtn btn btn-primary" onClick={() => setOpenModal(true)}>Add New Event</button> : ""}
				</Grid>
				{(!searchMode) ? <EventTypeSwitch/> : ""}
				<AddEventModal setReset={setResetUpcoming} reset={resetUpcoming} setResetPast={setResetPast} resetPast={resetPast} resetSearch={resetSearch} setResetSearch={setResetSearch} resetSearchCards={resetSearchCards} setResetSearchCards={setResetSearchCards} open={openModal} setOpen={setOpenModal} editMode={editMode} setEditMode={setEditMode} eventID={eventID} openEvent={setOpenEvent}/>
				<EventModal setReset={setResetUpcoming} reset={resetUpcoming} setResetPast={setResetPast} resetPast={resetPast} resetSearch={resetSearch} setResetSearch={setResetSearch} resetSearchCards={resetSearchCards} setResetSearchCards={setResetSearchCards} eventID={eventID} open={openEvent} setOpen={setOpenEvent} setOpenAdd={setOpenModal} editMode={editMode} setEditMode={setEditMode}/>
				{(searchMode) ? <SearchResults results={results} setEventID={setEventID} setOpenEvent={setOpenEvent} reset={resetSearchCards} searchMode={searchMode} searchType={searchType}/> 
				:
				<div>
					{(selectedType === "Upcoming") ? <UpcomingEvents setEventID={setEventID} setOpenEvent={setOpenEvent} reset={resetUpcoming}/> : null}
					{(selectedType === "Past") ? <PastEvents setEventID={setEventID} setOpenEvent={setOpenEvent} reset={resetPast}/> : null}
				</div>
				}
			</div>
		</div>
    );
};

export default OrgPortal;
