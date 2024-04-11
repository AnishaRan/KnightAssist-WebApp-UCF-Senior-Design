import React, {useState, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../StudentHome/StudentHeader';
import SearchSwitch from './SearchSwitch';
import Search from './Search';
import EventModal from './EventModal';
import OrgFavoriteEvents from './OrgFavoriteEvents';
import RecommendedEvents from './RecommendedEvents';
import RecommendedOrganizations from './RecommendedOrganizations';
import './StudentExplore.css'
import '../StudentHome/StudentHome.css';
import { Grid } from '@mui/material';
import SearchResults from '../OrgEvents/SearchResults';
import StudentTopBar from '../TopBar/StudentTopBar';

function StudentExplore()
{
    const [searchType, setSearchType] = useState("events");
    const [openEvent, setOpenEvent] = useState(false); 
    const [eventID, setEventID] = useState(("notoEventId" in sessionStorage) ? sessionStorage.getItem("notoEventId") : undefined)
    const [resetFavorite, setResetFavorite] = useState(1);
    const [resetRecEvents, setResetRecEvents] = useState(1);

	const [allOrgs, setAllOrgs] = useState(undefined);
	const [allOrgsFlag, setAllOrgsFlag] = useState(false);

	const [showSearch, setShowSearch] = useState(false);

	const [searchMode, setSearchMode] = useState(false);
	const [resetSearchCards, setResetSearchCards] = useState(1);
	const results = useRef([]);

    return(
      <div className='spartan' id='homePage'>
		<Header/>
		<StudentTopBar title="Explore"/>
		<div className='moveEverything'>
			<Grid container layout={'row'} width={"80%"} style={{ gap: "0 24px" }} marginLeft={"10%"}>		
				<Grid item>
					<SearchSwitch setSearchType={setSearchType}/>
				</Grid>
				<Grid item>
					<Search results={results} searchType={searchType} setEventID={setEventID} setOpenEvent={setOpenEvent} searchMode={searchMode} setSearchMode={setSearchMode} resetSearchCards={resetSearchCards} setResetSearchCards={setResetSearchCards} setAllOrgs={setAllOrgs} setAllOrgsFlag={setAllOrgsFlag}/>
				</Grid>
				<Grid item marginTop={1}>
					<button type="button" class="addEventBtn btn" disabled={(searchMode && !showSearch)} onClick={() => {setSearchMode(true); setResetSearchCards(resetSearchCards * -1)}}>Search</button>
				</Grid>
				<Grid item marginTop={1}>
					{(searchMode && searchType === "events") ? <button type="button" class="addEventBtn btn" onClick={() => setSearchMode(false)}>Exit Search</button> : ""}
				</Grid>
			</Grid>
			<EventModal setEventID={setEventID} eventID={eventID} open={openEvent} setOpen={setOpenEvent} resetFavorite={resetFavorite} setResetFavorite={setResetFavorite} resetRecEvents={resetRecEvents} setResetRecEvents={setResetRecEvents}/>
			{(searchMode) ? <SearchResults results={results} setEventID={setEventID} setOpenEvent={setOpenEvent} reset={resetSearchCards} searchMode={searchMode} searchType={searchType} allOrgs={allOrgs} allOrgsFlag={allOrgsFlag} setAllOrgsFlag={setAllOrgsFlag} setShowSearch={setShowSearch}/> 
				:
				<div>
					<OrgFavoriteEvents setEventID={setEventID} eventID={eventID} open={openEvent} setOpen={setOpenEvent} reset={resetFavorite}/>
					<RecommendedEvents setEventID={setEventID} eventID={eventID} open={openEvent} setOpen={setOpenEvent} reset={resetRecEvents}/>
					<RecommendedOrganizations setEventID={setEventID} eventID={eventID} open={openEvent} setOpen={setOpenEvent}/>
				</div>
			}
		</div>
      </div>
    );
};

export default StudentExplore;