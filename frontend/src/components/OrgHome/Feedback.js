import { useState, useEffect } from 'react';
import { Divider, List, ListItemButton, ListItemText, ListItem, IconButton, Box, Rating, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { buildPath } from '../../path';
import CloseIcon from '@mui/icons-material/Close';
import './OrgHome.css';
import { lightBlue } from '@mui/material/colors';

function Feedback() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(undefined);

  const handleCloseModal = async () => {
    if (selectedFeedback) {
      await readFeedback(selectedFeedback);
	  await fetchAllFeedback();
    }
    setModalOpen(false);
  };

  const handleOpenModal = (feedback) => {
    setSelectedFeedback(feedback);
    setModalOpen(true);
  };

  function openStudentPage(id){
	sessionStorage.setItem("viewingStudentPageID", id);
	window.location.href="/#/studentprofile";
  }


  const [items, setItems] = useState([]);

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + " ...";
    }
    return text;
  };

  const formatDate = (dateString) => {
    const isValidDate = !isNaN(new Date(dateString).getTime());

    if (isValidDate) {
      const options = { month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        undefined,
        options
      );
      return formattedDate;
    } else {
      return dateString;
    }
  };

  const fetchAllFeedback = async () => {
    const organizationID = sessionStorage.getItem("ID");
    try {
      let url = buildPath(
        `api/retrieveAllFeedback_ForAnOrg?orgId=${organizationID}`
      );

      let response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let res = JSON.parse(await response.text());

      console.log(res);
      const feedback = [];

      feedback.sort((a, b) =>
          new Date(b.timeFeedbackSubmitted) - new Date(a.timeFeedbackSubmitted)
      );

	  let i = 0;
 
	  // Only get 3 most recent feedbacks
	  while(i < res.length && i < 3 ){
		feedback.push(res[i]);
		if (res[i].wasReadByUser === false) {
			//unreadFeedback.push(feedback);
		}
		i++;
	  }

      setItems(feedback);
    } catch (e) {
      console.log("API called failed");
    }
  };

  const readFeedback = async (feedback) => {
    try {
      let url = buildPath(`api/markAsRead`);

      const json = {
        eventId: feedback.eventId,
        feedbackId: feedback._id,
      };

      let response = await fetch(url, {
        body: JSON.stringify(json),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let res = await response.text();
      console.log(res);
    } catch (e) {
      console.log("API called failed");
    }
  };

  const limitedItems = items.slice(0, 3);

  const handleItemClose = (itemId) => {
    const updatedItems = items.filter((item) => item._id !== itemId);
    setItems(updatedItems);
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  let boxBorder = (sessionStorage.getItem("theme") === 'light') ? 'grey.300' : 'grey.800';

  return (
    <Box
      sx={{
        border: 1,
        borderColor: boxBorder,
        width: "100%",
        minWidth: "600px",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: "3px",
      }}
    >
      <Typography
        variant="h5"
        sx={{ paddingLeft: 2, paddingTop: 2, paddingBottom: 1 }}
      >
        Recent Feedback
      </Typography>
      {limitedItems.length <= 0 ? (
        <div
          className="StudentHomePage-subtitle"
          style={{
            textAlign: "center",
            alignItems: "center",
            fontSize: "15px",
            color: "darkgray",
          }}
        >
          No feedback available
        </div>
      ) : (
        <List sx={{ flex: 1 }}>
          {limitedItems.map((item, i) => (
            <div key={item.id}>
              <ListItem
                disablePadding
                sx={{ maxHeight: "60px" }}
              >

              <ListItemButton
                sx={{ maxHeight: "60px" }}
                onClick={() => handleOpenModal(item)}
              >
                {limitedItems.includes(item) && item.wasReadByUser === false && (
                  <div className='unreadIcon'></div>
                )}
                <ListItemText
                  primary={
                    formatDate(item.createdAt) +
                    " " +
                    item.eventName 
                  }
                  secondary={truncateText(item.feedbackText, 40)}
                />
                <Rating value={item.rating} readOnly />
              </ListItemButton>

              </ListItem>
              {(i !== limitedItems.length - 1) ? <Divider variant="middle" sx={{background: (sessionStorage.getItem("theme") === 'light') ? 'black' : 'white'}}/> : ""}
            </div>
          ))}
        </List>
      )}

		{(selectedFeedback) ? 
			<Dialog open={modalOpen} onClose={handleCloseModal}>
				<DialogContent className='feedbackModal'>
					<button className={'closeFeedback ' + ((sessionStorage.getItem("theme") === "light")  ? "darkExit" : "lightExit")}>
						<CloseIcon onClick={handleCloseModal}/>
					</button>
					<DialogContentText color="textPrimary" style={{ marginBottom: 10}}>{formatDate(selectedFeedback.timeFeedbackSubmitted)}</DialogContentText>
					<DialogContentText color="textPrimary" className='contentWrap' style={{fontSize: 25, marginBottom: 10}}>{selectedFeedback.eventName}</DialogContentText>
					<DialogContentText color="textPrimary" style={{marginBottom: 5}}>
						<a className='hoverOrgName' style={{color: (sessionStorage.getItem("theme") === "light") ? "black" : "white"}} onClick={() => openStudentPage(selectedFeedback.studentId)}><b>{selectedFeedback.studentName}</b></a>
						<span className='emailSize'>{((selectedFeedback.studentEmail) ? " - " + selectedFeedback.studentEmail : "")}</span>		
						<Rating
							value={selectedFeedback.rating}
							readOnly
							className='cardRating'
						/>		
					</DialogContentText>
					<DialogContentText color="textPrimary" className='contentWrap' style={{ marginTop: '10px' }}>{selectedFeedback.feedbackText}</DialogContentText>
				</DialogContent>
			</Dialog>
			: null
		}
    </Box>
  );
}

export default Feedback;