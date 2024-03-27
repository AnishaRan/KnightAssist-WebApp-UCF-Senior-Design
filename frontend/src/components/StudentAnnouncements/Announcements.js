import React, { useEffect, useState } from 'react';
import Card from "@mui/material/Card";
import { Avatar, Box, Grid, Pagination } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import { buildPath } from '../../path';

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + " ...";
  }
  return text;
};

const formatDate = (dateString) => {
  const isValidDate = !isNaN(new Date(dateString).getTime());

  if (isValidDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  } else {
    return dateString;
  }
};

const Announcements = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedPic, setSelectedPic] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [numPages, setNumPages] = useState(0);  
  const [perPage, setPerPage] = useState(7);
  const [page, setPage] = useState(1);

  const handleClick = async (announcement) => {
    setSelectedAnnouncement(announcement);
	setSelectedPic(await getOrgPic(announcement.organizationID));
    setIsModalOpen(true);
  };

  function openOrgPage(id){
	sessionStorage.setItem("viewingPageID", id);
	window.location.href="/#/orgprofile";
  }

  async function getOrgPic(id){
	const url = buildPath(`api/retrieveImage?typeOfImage=2&id=${id}`);

	console.log(id);

	const response = await fetch(url, {
		method: "GET",
		headers: {"Content-Type": "application/json"},
	});

	let orgPic = JSON.parse(await response.text());
	
	return orgPic.url;
  }

	async function changePage(e, value){
		setPage(value);
		console.log(props.announcements);

		const announcementSlice = props.announcements.slice(perPage * (value - 1), perPage * (value - 1) + perPage);

		const pics = [];

		for(let ann of announcementSlice){
			pics.push(await getOrgPic(ann.organizationID));
		}

		console.log(pics);

		const theAnnouncements = props.announcements.slice(perPage * (value - 1), perPage * (value - 1) + perPage).map((announcement, i) => {
			const { updateID, title, content, date, name, organizationID } = announcement;
  
			return (
			  <Grid item xs={10} key={updateID} marginTop={"5px"}>
				<Card variant="outlined" onClick={() => handleClick(announcement)}>
				  <CardActionArea>
					<CardContent className="content">
					  <Typography
						gutterBottom
						variant="h5"
						component="h2"
						className="title"
					  >
						{truncateText(title, 35)}
					  </Typography>
					  <Typography
						variant="body2"
						component="p"
					  >
						<Avatar className="orgPicAnn" src={pics[i]}/>{name}
					  </Typography>
					  <Typography
						variant="body2"
						component="p"
						style={{ position: 'absolute', top: 0, right: 0, margin: '15px' }}
						className='showDate'
					  >
						{formatDate(date)}
					  </Typography>
					  <Typography
						variant="body2"
						component="p"
						style={{ marginTop: '6px' }}
					  >
						<i>{truncateText(content, 320)}</i>
					  </Typography>
					</CardContent>
				  </CardActionArea>
				</Card>
			  </Grid>
			);
		  });
		setAnnouncements(theAnnouncements);
	}

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
	const getAnnouncements = async() => await changePage(null, 1);
	const setNotoPic = async() => setSelectedPic(await getOrgPic(JSON.parse(sessionStorage.getItem("notoUpdate")).organizationID));

	if(props.announcements){	
		setNumPages(Math.ceil(props.announcements.length / perPage));
		getAnnouncements();
	}
	if("notoUpdate" in sessionStorage){
		setSelectedAnnouncement(JSON.parse(sessionStorage.getItem("notoUpdate")));
		setNotoPic();
		setIsModalOpen(true);
		sessionStorage.removeItem("notoUpdate");
	}
  }, [props.announcements]);

  return (
    <div className="announcementCardList">
      <Grid
        container
        spacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {announcements}
      </Grid>
	  <Box my={3} display="flex" justifyContent="center">
	  	<Pagination className="feedbackPagination" page={page} count={numPages} onChange={changePage} shape="rounded" />
	  </Box>

      	<Dialog open={isModalOpen} onClose={handleCloseModal}>
			<DialogContent className='feedbackModal'>
				<button className='closeFeedback'>
					<CloseIcon onClick={handleCloseModal}/>
				</button>
				<DialogContentText color="textPrimary" className='contentWrap' style={{ fontSize: 25, marginBottom: 10}}>{selectedAnnouncement?.title}</DialogContentText>
				<DialogContentText color="textPrimary"style={{ marginBottom: 10}}>{formatDate(selectedAnnouncement?.date)}</DialogContentText>
				<DialogContentText color="textPrimary"><a className='hoverOrgName' style={{color: (sessionStorage.getItem("theme") === "light") ? "black" : "white"}}onClick={() => openOrgPage(selectedAnnouncement?.organizationID)}><Avatar className="modalOrgPic orgPicAnn" src={selectedPic}/><b>{selectedAnnouncement?.name}</b></a></DialogContentText>
				<DialogContentText color="textPrimary" className='contentWrap' style={{ marginTop: '10px' }}>{selectedAnnouncement?.content}</DialogContentText>
			</DialogContent>
		</Dialog>
    </div>
  );
};

export default Announcements;
