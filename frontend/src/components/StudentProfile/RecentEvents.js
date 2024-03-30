import {useState, useEffect} from 'react';
import { buildPath } from '../../path';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import '../OrgEvents/OrgEvents';
import { CalendarIcon } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function RecentEvents(props)
{

    const [events, setEvents] = useState([]);
    const [eventCards, setEventCards] = useState();
    const [numPages, setNumPages] = useState(0);  
    const [page, setPage] = useState(1);
	const [eventsPerPage, setEventsPerPage] = useState(getInitialPerPage());
	
	// Bug purposes
	const [initiateListener, setInitiateListener] = useState(1);

	function getInitialPerPage(){
		const width = window.innerWidth;

		if(width > 1500){
			return 3;
		}else if(width > 900){
			return 2;
		}else{
			return 1;
		}
	}

	function changePage(e, value, perPage = eventsPerPage){
		setPage(value);
		let content = <div className="cards d-flex flex-row cardWhite card-body-profile">{events.slice(perPage * (value - 1), perPage * (value - 1) + perPage)}</div>
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
		let studentID;
		
		if("viewingStudentPageID" in sessionStorage && 
		   sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingStudentPageID")){
			studentID = sessionStorage.getItem("viewingStudentPageID");
		}else{
			studentID = sessionStorage.getItem("ID");
		}

        let url = buildPath(`api/searchUserRSVPedEvents?studentID=${studentID}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        let res = JSON.parse(await response.text());

        console.log(res);    

	    const events = [];

        for(let event of res){
            if(!eventIsUpcoming(event.endTime)){
				console.log(event)
				url = buildPath(`api/retrieveImage?typeOfImage=1&id=${event._id}`);

				response = await fetch(url, {
					method: "GET",
					headers: {"Content-Type": "application/json"},
				});
		
				let pic = JSON.parse(await response.text());

                const orgName = await getOrgName(event.sponsoringOrganization);
                events.push(<Event name={event.name} pic={pic} orgName={orgName} startTime={event.startTime} endTime={event.endTime} id={event._id}/>)  
            }
        }

        events.sort(function(a,b){ 
            return a.props.startTime.localeCompare(b.props.startTime)
        });

        setNumPages(Math.ceil(events.length / eventsPerPage))
        setEvents(events);

		setInitiateListener(initiateListener * -1);

        let extraBack = 0;
        
        // Need to go a page back due to deletion
        if(((page - 1) * eventsPerPage) >= events.length){
            setPage(page - 1);
            extraBack = 1;
        }

        let content = <div className="cards d-flex flex-row cardWhite card-body-profile">{events.slice((page - 1 - extraBack) * eventsPerPage, (page - 1 - extraBack) * eventsPerPage + eventsPerPage)}</div>
        setEventCards(content);
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
								<CalendarIcon className='cardCalendar'/>
								{startDay + ((hasEndDate) ? ("\n-\n      " + endDay)  : "")}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </div>
        )
    }

    function Events(){
        return (
            <div className="">       
                {eventCards}
            </div>
        )
    }

    useEffect(()=>{
        getEvents();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

	useEffect(()=>{
		const adjustForSize = () => {
			if(!eventCards) return;
			const width = window.innerWidth;
			
			const oldEventsPerPage = eventsPerPage;

			if(width > 1500){
				setEventsPerPage(3);
				setNumPages(Math.ceil(events.length / 3))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 3), 3);
			}else if(width > 900){
				setEventsPerPage(2);
				setNumPages(Math.ceil(events.length / 2))
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 2), 2);
			}else{
				setEventsPerPage(1);
				setNumPages(events.length)
				changePage(null, Math.ceil((((page - 1) * oldEventsPerPage) + 1) / 1), 1);
			}
		}

		window.addEventListener("resize", adjustForSize);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[initiateListener])

    return(
     <div className='centerCards'>
		{(eventCards) ? 
		    <div>
				<Events/>
				<Box my={2} display="flex" justifyContent="center">
					<Pagination className="feedbackPagination" page={page} count={numPages} onChange={changePage} shape="rounded" />
				</Box>
			</div>
			: <CircularProgress className='spaceCircleProgress'/>
		}
     </div>
    );
};

export default RecentEvents;