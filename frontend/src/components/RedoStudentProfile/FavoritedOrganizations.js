import {useState, useEffect} from 'react';
import { buildPath } from '../../path';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import '../OrgEvents/OrgEvents';

function FavoriteOrganizations(props)
{

    const [orgs, setOrgs] = useState([]);
    const [orgCards, setOrgCards] = useState();
    const [numPages, setNumPages] = useState(0);  
    const [page, setPage] = useState(1);
	const [orgsPerPage, setOrgsPerPage] = useState(getInitialPerPage());
	const [windowSize, setWindowSize] = useState(undefined);
	
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

	function changePage(e, value, perPage = orgsPerPage){
		setPage(value);
		let content = <div className="cards d-flex flex-row cardWhite card-body-profile">{orgs.slice(perPage * (value - 1), perPage * (value - 1) + perPage)}</div>
		setOrgCards(content);
	}

    // Will open the organization's page
    function openOrgPage(id){
		sessionStorage.setItem("viewingPageID", id);
		window.location.href="/#/orgprofile";
    }

    async function getOrgs(){
		let studentID;
		
		if("viewingStudentPageID" in sessionStorage && 
		   sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingStudentPageID")){
			studentID = sessionStorage.getItem("viewingStudentPageID");
		}else{
			studentID = sessionStorage.getItem("ID");
		}

        let url = buildPath(`api/loadFavoritedOrgs?userID=${studentID}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        let res = JSON.parse(await response.text());

	    console.log(res);

        for(let org of res){
			// Gets profile pic of org
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

        setNumPages(Math.ceil(orgs.length / orgsPerPage))
        setOrgs(orgs);

		setInitiateListener(initiateListener * -1);

        let extraBack = 0;
        
        // Need to go a page back due to deletion
        if(((page - 1) * orgsPerPage) >= orgs.length){
            setPage(page - 1);
            extraBack = 1;
        }

        let content = <div className="cards d-flex flex-row cardWhite card-body-profile">{orgs.slice((page - 1 - extraBack) * orgsPerPage, (page - 1 - extraBack) * orgsPerPage + orgsPerPage)}</div>
        setOrgCards(content);
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
                                {(props.description.length >= 80) ? (props.description.substring(0, 80) + "...") : props.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </CardActionArea>
            </div>
        )
    }

    function Orgs(){
        return (
            <div className="">       
                {orgCards}
            </div>
        )
    }

    useEffect(()=>{
        getOrgs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

	useEffect(() => {
		if(windowSize){
			if(!orgCards) return;
			
			const width = windowSize;
			
			const oldOrgsPerPage = orgsPerPage;

			if(width > 1500){
				setOrgsPerPage(3);
				setNumPages(Math.ceil(orgs.length / 3));
				changePage(null, Math.ceil((((page - 1) * oldOrgsPerPage) + 1) / 3), 3);
			}else if(width > 900){
				setOrgsPerPage(2);
				setNumPages(Math.ceil(orgs.length / 2))
				changePage(null, Math.ceil((((page - 1) * oldOrgsPerPage) + 1) / 2), 2);
			}else{
				setOrgsPerPage(1);
				setNumPages(orgs.length)
				changePage(null, Math.ceil((((page - 1) * oldOrgsPerPage) + 1) / 1), 1);
			}
		}
	}, [windowSize])

	useEffect(()=>{
		const adjustForSize = () => {setWindowSize(window.innerWidth);}

		window.addEventListener("resize", adjustForSize);
	},[initiateListener]);

    return(
     <div className='centerCards'>
		{(orgCards) ? 
		    <div>
				<Orgs/>
				<Box my={2} display="flex" justifyContent="center">
					<Pagination className="feedbackPagination" page={page} count={numPages} onChange={changePage} shape="rounded" />
				</Box>
			</div>
			: <CircularProgress className='spaceCircleProgress'/>
		}
     </div>
    );
};

export default FavoriteOrganizations;