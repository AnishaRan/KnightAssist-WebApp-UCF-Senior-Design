import {useState, useEffect} from 'react';
import { buildPath } from '../../path';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, CardActionArea, CircularProgress, Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import './OrgEvents';
import { CalendarIcon } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function SearchResults(props)
{

    const [events, setEvents] = useState([]);
    const [eventCards, setEventCards] = useState();
    const [numPages, setNumPages] = useState(0);  
    const [page, setPage] = useState(1);
	const [eventsPerPage, setEventsPerPage] = useState(getInitialPerPage());
	
	// Bug purposes
	const [initiateListener, setInitiateListener] = useState(1);

	const [windowSize, setWindowSize] = useState(undefined);

	function getInitialPerPage(){
		const width = window.innerWidth;

		if(width > 1500){
			return 12;
		}else if(width > 1200){
			return 9;
		}else if(width > 1045){
			return 6;
		}else{
			return 3;
		}
	}

    function changePage(e, value, perPage = eventsPerPage){
        setPage(value);
        let content = <div className="rowCards cards d-flex flex-row cardWhite card-body">{events.slice(perPage * (value - 1), (perPage * (value - 1) + perPage))}</div>
		setEventCards(content);
    }

    function openEventModal(id){
        props.setEventID(id);
        props.setOpenEvent(true);
    }

	function openOrgPage(id){
		sessionStorage.setItem("viewingPageID", id);
		window.location.href="/#/orgprofile";
	}

	async function getOrgs(){
		const orgs = [];

		let theSearch;

		if(props.allOrgsFlag === true){
			props.setAllOrgsFlag(false);
			theSearch = props.allOrgs;
		}else{
			theSearch = props.results.current;
		}

		try{
			for(let i of theSearch){
				let url = buildPath(`api/organizationSearch?organizationID=${i.id}`);
	
				let response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
	
				let org = JSON.parse(await response.text());
	
				url = buildPath(`api/retrieveImage?typeOfImage=2&id=${org._id}`);
	
				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let profilePic = JSON.parse(await response.text());
	
				// Gets background pic of org
				url = buildPath(`api/retrieveImage?typeOfImage=4&id=${org._id}`);
	
				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let background = JSON.parse(await response.text());
	
				orgs.push(<Org name={org.name} profilePic={profilePic} background={background} description={org.description} id={org._id}/>) 
			}   
		}catch(e){
			console.log(e);
		} 

		setNumPages(Math.ceil(orgs.length / eventsPerPage))
        setEvents(orgs);

		setInitiateListener(initiateListener * -1);
        
		let page = 1;
		setPage(1);

		let content;

		if(orgs.length === 0){
			content = <div className="noResults">No Organizations Found</div>
		}else{
			content = <div className="rowCards cards d-flex flex-row cardWhite card-body">{orgs.slice((page - 1) * eventsPerPage, ((page - 1) * eventsPerPage + eventsPerPage))}</div>
		}

        setEventCards(content);
		props.setShowSearch(true);
	}

    async function getEvents(){
        let events = [];

        for(let i of props.results.current){
			let url = buildPath(`api/searchOneEvent?eventID=${i.id}`);

			let response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			let event = JSON.parse(await response.text());

			// Not found
			if(event.length < 1) continue

			event = event[0];

			url = buildPath(`api/retrieveImage?typeOfImage=1&id=${event._id}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let pic = JSON.parse(await response.text());
			
			url = buildPath(`api/organizationSearch?organizationID=${event.sponsoringOrganization}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			let org = JSON.parse(await response.text());
			
			url = buildPath(`api/retrieveImage?typeOfImage=2&id=${event.sponsoringOrganization}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let orgPic = JSON.parse(await response.text());

			events.push(<Event name={event.name} pic={pic} orgName={(sessionStorage.getItem("role") === "volunteer") ? org.name : undefined} orgPic={(sessionStorage.getItem("role") === "volunteer") ? orgPic.url : undefined} startTime={event.startTime} endTime={event.endTime} id={event._id}/>)
        }       

		events.sort(function(a,b){ 
            return b.props.startTime.localeCompare(a.props.startTime)
        });

		console.log(events);

        setNumPages(Math.ceil(events.length / eventsPerPage))
        setEvents(events);

		setInitiateListener(initiateListener * -1);

		let page = 1;
		setPage(1);

		let content;

		if(events.length === 0){
			content = <div className="noResults">No Events Found</div>
		}else{
			content = <div className="rowCards cards d-flex flex-row cardWhite card-body">{events.slice((page - 1) * eventsPerPage, ((page - 1) * eventsPerPage + eventsPerPage))}</div>
		}

        setEventCards(content);
		props.setShowSearch(true);
    }

    function Event(props) {     
		const startDay = new Date(dayjs(props.startTime)).toLocaleDateString();
		const endDay = new Date(dayjs(props.endTime)).toLocaleDateString();

		let hasEndDate = (startDay !== endDay);

        return (
            <div className="event spartan">
                <CardActionArea className='test'>
                    <Card className="eventHeight" onClick={() => openEventModal(props.id)}>
                        <CardMedia
                            component="img"
                            height="150"
                            image={props.pic.url}
                        />
                        <CardContent>
                            <Typography className='eventName' clagutterBottom variant="h6" component="div">
                                {((props.name.length >= 40) ? (props.name.substring(0, 40) + "...") : props.name)}
                            </Typography>
                            <Typography className="eventDate" variant="body2" color="text.secondary">
								{(sessionStorage.getItem("role") === "volunteer") ? <Grid container direction="row" sx={{display: 'flex', justifyContent: 'center'}}><Avatar className="orgPicCard" src={props.orgPic}/>{props.orgName}</Grid> : ""}
								<CalendarIcon className='cardCalendar'/>
								{startDay + ((hasEndDate) ? ("\n-\n      " + endDay)  : "")}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </div>
        )
    }

	function Org(props) {      
        return (
            <div className="event spartan">
                <CardActionArea className='test'>
                    <Card className="eventHeight" onClick={() => openOrgPage(props.id)}>
						<div className='logoandbg'>
							<CardMedia
								component="img"
								className='cardBg'
								height="125"
								image={props.background.url}
							/>
							<Avatar
								className='cardLogo'
                              	src={props.profilePic.url}
								sx={{zIndex: 2, position: "absolute", width: 100, height: 100, marginTop: -7, borderStyle: "solid", borderColor: "white"}}
                           />
						</div>
                        <CardContent>
                            <Typography className='eventName' clagutterBottom variant="h6" component="div">
                                {props.name}
                            </Typography>
                            <Typography>
                                {(props.description !== undefined) ? ((props.description.length >= 80) ? (props.description.substring(0, 80) + "...") : props.description) : ""}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </div>
        )
    }

    function Events(){
        return (
            <div className="cardSpace">       
                {eventCards}
            </div>
        )
    }

    useEffect(()=>{
		setPage(1);
		if(props.searchType === "events")
			getEvents();
		else
			getOrgs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
		setEventCards(undefined);
		setPage(1);
		props.setShowSearch(false);
		if(props.searchType === "events")
			getEvents();
		else
			getOrgs();		
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.reset])

	useEffect(() => {
		if(windowSize){
			if(!eventCards) return;
			const width = window.innerWidth;
			
			const oldEventsPerPage = eventsPerPage;

			if(width > 1500){
				setEventsPerPage(12);
				setNumPages(Math.ceil(events.length / 12))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 12), 12);
			}else if(width > 1200){
				setEventsPerPage(9);
				setNumPages(Math.ceil(events.length / 9))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 9), 9);
			}else if(width > 1045){
				setEventsPerPage(6);
				setNumPages(Math.ceil(events.length / 6))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 6), 6);
			}else{
				setEventsPerPage(3);
				setNumPages(Math.ceil(events.length / 3))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 3), 3);
			}
		}
	}, [windowSize])

	useEffect(()=>{
		const adjustForSize = () => {setWindowSize(window.innerWidth);}

		window.addEventListener("resize", adjustForSize);
	},[initiateListener])

    return(
     <div className='upcomingEventsSpace centerCards'>
		{(eventCards) ?
		    <div>
				<Events/>
				{(events.length > 0) ? <Pagination className="eventsPagination" page={page} count={numPages} onChange={changePage} shape="rounded"/> : ""}
			</div>
			: <CircularProgress/>
		}
     </div>
    );
};

export default SearchResults;