import {useState, useEffect} from 'react';
import { buildPath } from '../../path';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, Box, CardActionArea, CircularProgress, Grid } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import '../OrgEvents/OrgEvents';
import { CalendarIcon } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function RecommendedEvents(props)
{

    const [events, setEvents] = useState([]);
    const [eventCards, setEventCards] = useState();
    const [numPages, setNumPages] = useState(0);  
    const [page, setPage] = useState(1);
	const [eventsPerPage, setEventsPerPage] = useState(getInitialPerPage());
	const [windowSize, setWindowSize] = useState(undefined);
	
	// Bug purposes
	const [initiateListener, setInitiateListener] = useState(1);

	function getInitialPerPage(){
		const width = window.innerWidth;

		if(width > 1500){
			return 4;
		}else if(width > 1200){
			return 3;
		}else if(width > 925){
			return 2;
		}else{
			return 1;
		}
	}

	function changePage(e, value, perPage = eventsPerPage){
		setPage(value);
		let content = <div className="cards d-flex flex-row cardWhite card-body">{events.slice(perPage * (value - 1), perPage * (value - 1) + perPage)}</div>
		setEventCards(content);
	}

    function openEventModal(id){
        props.setEventID(id);
        props.setOpen(true);
    }

	// Event has not happened yet or is not over
    function eventIsUpcoming(endTime){
        return new Date().toISOString().localeCompare(endTime) < 0;
	}

    async function getOrgName(id){
        let url = buildPath(`api/organizationSearch?organizationID=${id}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
    
        let res = JSON.parse(await response.text());

        return res.name;
    }

    async function getEvents(){
        let url = buildPath(`api/getSuggestedEvents_ForUser?userID=${sessionStorage.getItem("ID")}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        let res = JSON.parse(await response.text());

        console.log(res);    

	    const events = [];

        for(let event of res){
            if(eventIsUpcoming(event.endTime)){
				url = buildPath(`api/retrieveImage?typeOfImage=1&id=${event._id}`);

				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let pic = JSON.parse(await response.text());

                const orgName = await getOrgName(event.sponsoringOrganization);

				url = buildPath(`api/retrieveImage?typeOfImage=2&id=${event.sponsoringOrganization}`);

				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let orgPic = JSON.parse(await response.text());

                events.push(<Event name={event.name} pic={pic} orgName={orgName} orgPic={orgPic.url} startTime={event.startTime} endTime={event.endTime} id={event._id} description={event.description}/>)  
            }
        }

        events.sort(function(a,b){ 
            return a.props.startTime.localeCompare(b.props.startTime)
        });

        setNumPages(Math.ceil(events.length / 4))
        setEvents(events);

		setInitiateListener(initiateListener * -1);

        let extraBack = 0;
        
        // Need to go a page back due to deletion
        if(((page - 1) * 4) >= events.length){
            setPage(page - 1);
            extraBack = 1;
        }

        // There were no events prior and now there is one
        if(page === 0 && events.length > 0){
            setPage(1);
            extraBack = -1;
        }
		
        let content = <div className="cards d-flex flex-row cardWhite card-body">{events.slice((page - 1 - extraBack) * 4, (page - 1 - extraBack) * 4 + 4)}</div>
        setEventCards(content);
    }

    function EventHeader(){
        return <h1 className='upcomingEvents spartan'><span style={{ fontWeight: '350' }}>Recommended Events</span></h1>
    }

    function Event(props) {     
		const startDay = new Date(dayjs(props.startTime)).toLocaleDateString();
		const endDay = new Date(dayjs(props.endTime)).toLocaleDateString();

		let hasEndDate = (startDay !== endDay);

        return (
            <div className="event spartan">
                <CardActionArea className='test'>
                    <Card variant='outlined' className="eventHeight" onClick={() => openEventModal(props.id)}>
                        <CardMedia
                            component="img"
                            height="150"
                            image={props.pic.url}
                        />
                        <CardContent className='whiteCardSection' style={{backgroundColor: (sessionStorage.getItem("theme") === "light") ? "white" : "#1e1e1e"}}>
                            <div className='initialText'>
                                <Typography className='eventName' clagutterBottom variant="h6" component="div">
                                    {((props.name.length >= 40) ? (props.name.substring(0, 40) + "...") : props.name)}
                                </Typography>
                                <Typography sx={{transform: 'translateY(20px)'}} className="eventDate" variant="body2" color="text.secondary">
                                    <Grid container direction="row" sx={{display: 'flex', justifyContent: 'center'}}><Avatar className="orgPicCard" src={props.orgPic}/>{props.orgName}</Grid>
                                    <CalendarIcon className='cardCalendar'/>
                                    {startDay + ((hasEndDate) ? ("\n-\n      " + endDay)  : "")}
                                </Typography>
                            </div>
                            <div className="hoverText">
                                <Typography>
                                    {((props.description.length >= 140) ? (props.description.substring(0, 140) + "...") : props.description)}
                                </Typography>
                            </div>
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
        getEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        getEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.reset])

	useEffect(() => {
		if(windowSize){
			if(!eventCards) return;
			
			const width = windowSize;
			
			const oldEventsPerPage = eventsPerPage;

			if(width > 1500){
				setEventsPerPage(4);
				setNumPages(Math.ceil(events.length / 4));
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 4), 4);
			}else if(width > 1200){
				setEventsPerPage(3);
				setNumPages(Math.ceil(events.length / 3))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 3), 3);
			}else if(width > 925){
				setEventsPerPage(2);
				setNumPages(Math.ceil(events.length / 2))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 2), 2);
			}else{
				setEventsPerPage(1);
				setNumPages(events.length)
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 1), 1);
			}
		}
	}, [windowSize])

	useEffect(()=>{
		const adjustForSize = () => {setWindowSize(window.innerWidth);}

		window.addEventListener("resize", adjustForSize);
	},[initiateListener])


    return(
     <div className='upcomingEventsSpace'>
        <EventHeader/>
		{(eventCards) ? 
		    <div>
				<Events/>
				<Box my={2} display="flex" justifyContent="center">
					<Pagination className="explorePagination" page={page} count={numPages} onChange={changePage} shape="rounded"/>
				</Box>
			</div>
			: <CircularProgress/>
		}
     </div>
    );
};

export default RecommendedEvents;
