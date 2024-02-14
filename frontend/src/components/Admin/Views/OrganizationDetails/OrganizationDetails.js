import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, Button, Alert, Snackbar, Dialog, IconButton } from '@mui/material';
import { buildPath } from '../../../../path.js';
import AdminHeader from '../../AdminHeader.js';
import '../StudentDetails/StudentDetails.css';
import AdminTopBar from '../../AdminTopBar.js';
// import UpcomingEvents from './UpcomingEvents.js';
// import EventHistory from './EventHistory.js';
import CancelIcon from '@mui/icons-material/Cancel';
// import StudentSearchBar from './StudentSearchBar.js';
// import StudentToggle from './StudentToggle.js';
import Tabs from './Tabs.js';

function OrganizationDetails({ organizationID }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tags, setTags] = useState([]);
  const [totalHours, setTotalHours] = useState('');
  const [id, setId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('')
  const [openAlert, setOpenAlert] = useState(true);
  // const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [prevSelectedTags, setPrevSelectedTags] = useState([]);
  const [userInputTags, setUserInputTags] = useState([]);
  const [fetchAllTags, setFetchAllTags] = useState([]);
  const [selectedToggle, setSelectedToggle] = useState('past');
  const [searchTerm, setSearchTerm] = useState('');
  // const [eventHistory, setEventHistory] = useState([]);

  const handleToggleChange = (newToggleValue) => {
    setSelectedToggle(newToggleValue);
    console.log(newToggleValue);
  };

  const fetchOrganizationInfo = async () => {
    console.log(organizationID);
    try {
      let url = buildPath(`api/organizationSearch?organizationID=${organizationID}`);

      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      let res = JSON.parse(await response.text());

      console.log(res);
      setName(res.name);
      // setLastName(res.lastName);
      setEmail(res.email);
      setTags(res.categoryTags);
      // setTotalHours(res.totalVolunteerHours);
      // setGoal(res.semesterVolunteerHourGoal);
      setId(res._id);
      // setUpcomingEvents(res.eventsRSVP);
      setPrevSelectedTags(res.categoryTags);

      // fetch past/upcoming events
      // fetchEventHistory(res._id);

      // get profile pic
    } catch (e) {
      console.log('failed to fetch student info: ' + e);
    }
  };

  // const fetchEventHistory = async (studentID) => {
  //   console.log(studentID);
  //   try {
	// 		let url = buildPath(`api/historyOfEvents_User?studentId=${studentID}`);

	// 		let response = await fetch(url, {
	// 			method: "GET",
	// 			headers: {"Content-Type": "application/json"},
	// 		});
		
	// 		let res = JSON.parse(await response.text());

	// 		// Sort by time if date is equal, date otherwise
	// 		res.sort(function(a, b) {
	// 			return Date.parse(a.checkIn[0] + " " + a.checkIn[1]) - Date.parse(b.checkIn[0] + " " + b.checkIn[1]);
	// 		});
  //     console.log(res);
	// 		setEventHistory(res);
  //   } catch(e) {
  //     console.log("oopsies failed to fetch student event history");
  //   }
  // };

  async function submitVolunteer(){
		try{
			// Store picture
			// if(picFile !== null && typeof picFile.name === "string"){
			// 	let formData = new FormData();
			// 	formData.append('profilePic', picFile); 
			// 	formData.append('entityType', 'volunteer');
			// 	formData.append('id', sessionStorage.getItem("ID"));
			// 	formData.append('profilePicOrBackGround', '0');

			// 	// Store the picture selected to be associated with the event
			// 	await fetch(buildPath(`api/storeImage`), {
			// 		method: 'POST',
			// 		body: formData
			// 	})
			// 	.then(response => response.json())
			// 	.then(data => console.log(data))
			// 	.catch(error => console.error('Error:', error));
			// }

			const json = 
			{
        _id: id,
				email: email, // use old email to find correct student
				// semesterVolunteerHourGoal: goal,
        // totalVolunteerHours: totalHours,
        // firstName: firstName,
        // lastName: lastName,
        name: name,

				// categoryTags: selectedTags
			}
      // saving semesterVolHourGoal + totalVolHours are switched

			const url = buildPath(`api/editOrganizationProfile`);
      //buildPath(`api/userSearch?userID=${sessionStorage.getItem("ID")}`);

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {"Content-Type": "application/json",         
				        "Authorization": `Bearer ${sessionStorage.getItem("token")}`}
            });
            if (response.status == 404) {
              setMessage("Error occured, could not save information");
              fetchOrganizationInfo();

            } else {
              setMessage("Information saved successfully");
            }
            let res = await response.text();

		}catch(e){
			console.log(e);
		}
	}


async function handleEditTags() {
  setOpenModal(true);

  try {
    let url = buildPath(`api/getAllAvailableTags`);

    let response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    let res = JSON.parse(await response.text());

    setAllTags(res);
  } catch (e) {
    console.log('failed to fetch available tags: ' + e);
  }
}


const AllTags = ({ tags }) => {
  const handleChipClick = (tag) => {
    const isSelected = prevSelectedTags.includes(tag);
    if (isSelected) {
      setPrevSelectedTags(prevSelectedTags.filter((selectedTag) => selectedTag !== tag));
    } else if(!isSelected && prevSelectedTags.length < 10) {
      setPrevSelectedTags([...prevSelectedTags, tag]);
    }
  };

  return (
    <div className='allTagsBox'>
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          onClick={() => handleChipClick(tag)}
          color={prevSelectedTags.includes(tag) ? 'secondary' : 'default'}
          style={{ margin: '3px', backgroundColor: prevSelectedTags.includes(tag) ? '#5f5395' : '' }}
        />
      ))}
    </div>
  );
};

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleTagSelect = (tag) => {
    if (prevSelectedTags.includes(tag)) {
      setPrevSelectedTags((prevSelectedTags) => {
        // Remove the tag from the array
        return prevSelectedTags.filter((selectedTag) => selectedTag !== tag);
      });
    } else if (selectedTags.includes(tag)) {
      // Check if the tag is already selected in selectedTags
      setSelectedTags((prevSelectedTags) => {
        // Remove the tag from the array
        return prevSelectedTags.filter((selectedTag) => selectedTag !== tag);
      });
    } else {
      // If the tag is not selected, check the total count
      const totalSelectedCount = prevSelectedTags.length + selectedTags.length;
  
      if (totalSelectedCount <= 10) {
        // If the total count is less than 10, add the tag to the arrays
        setPrevSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
        setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
      } else {
        // Otherwise, do not add more tags
        // You can also show a message or handle this case as needed
      }
    }
  };
  
  
  // const handleClickOpenModal = () => {
  //   setOpenModal(true);
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchOrganizationInfo();
  }, []);

  const handleCancel = (modalType) => {
    if(modalType == "tags") {
      fetchOrganizationInfo();
      setOpenModal(false);
    } else {
      fetchOrganizationInfo();
      setEditMode(false);
    }
  };

  const handleEditModeToggle = () => {
    if (editMode) {
      setMessage('');
      setOpenAlert(true);
      submitVolunteer();
    }
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const handleSaveTags = async () => {
    try {
      // Implement logic to save selected tags
      const json = {
        id: id,
        categoryTags: prevSelectedTags,
      };
  
      var url = buildPath(`api/editOrganizationProfile`);
  
      var response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200) {
        setMessage("Tags saved successfully");
      } else {
        setMessage("Error occurred, could not save tags");
      }
  
      setOpenModal(false);
    } catch (e) {
      console.log("Error saving tags: ", e);
    }
  };
  

  return (
    <div>
      <div className='studentDetailsOutline'>
        <AdminHeader />
        <AdminTopBar />
      </div>
      <div className='studentDetailsContent'>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link underline='hover' color='inherit' href='/#/adminhome'>
            Home
          </Link>
          <Typography color='text.primary'>{name}</Typography>
        </Breadcrumbs>
        <Tabs/>
        <div className='studentDetailsFields' style={{ marginTop: '10px' }} >
          <div className='studentDetailsFirst' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsFirstText'>Name</div>
            {editMode ? (
              <TextField
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant='outlined'
              />
            ) : (
              <div className='studentDetailsFirstText'>{name}</div>
            )}
          </div>
          {/* <div className='studentDetailsLast' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsLastText'>Last Name</div>
            {editMode ? (
              <TextField
              size='small'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant='outlined'
              />
            ) : (
              <div className='studentDetailsLastText'>{lastName}</div>
            )}
          </div> */}
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Email</div>
            {editMode ? (
              <TextField
              size='small'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant='outlined'
              />
            ) : (
              <div className='studentDetailsEmailText'>{email}</div>
            )}
          </div>
          <div className='studentDetailsInterests' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsInterestsText'>Interests</div>
            {prevSelectedTags.length > 0 && (
              <div className='studentDetailsInterestsField'>
                <div className='studentDetailsInterestsTags'>
                  {prevSelectedTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      sx={{ margin: '4px', fontSize: '16px', padding: '10px', color: 'white', backgroundColor: '#5f5395' }}
                    />
                  ))}
                </div>
                {editMode && <EditIcon sx={{ marginLeft: '8px', cursor: 'pointer' }} onClick={handleEditTags} />}
              </div>
            )}
          </div>
          {/* <div className='studentDetailsTotal' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsTotalText'>Total Volunteer Hours</div>
            {editMode ? (
              <TextField
              size='small'
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              variant='outlined'
              />
            ) : (
              <div className='studentDetailsTotalText'>{totalHours}</div>
            )}
          </div> */}
          {/* <div className='studentDetailsGoal' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsGoalText'>Hour Goal</div>
            {editMode ? (
              <TextField
              size='small'
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              variant='outlined'
              />
            ) : (
              <div className='studentDetailsGoalText'>{goal}</div>
            )}
          </div> */}
          <div>
            {editMode && (
              <Button variant='outlined' disableElevation   sx={{
                marginBottom: '10px',
                borderColor: editMode ? '#808080' : '',
                color: editMode ? '#666666' : '',
                '&:hover': {
                  borderColor: editMode ? '#777777' : '',
                  backgroundColor: editMode ? '#f0f0f0' : '',
                  // color: editMode ? '#ffffff' : '',
                },
                marginRight: '10px',
              }} onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button variant='contained' disableElevation onClick={handleEditModeToggle} sx={{marginBottom: '10px', backgroundColor: editMode ? '#45a049' : '', '&:hover': {backgroundColor: editMode ? '#3f8e41' : ''} }}>{editMode ? 'Save' : 'Edit'}</Button>
            </div>
          {message.length !== 0 && (
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
              {message.includes("Error") ? (
                <Alert severity="error" onClose={handleCloseAlert}>
                  {message}
                </Alert>
              ) : (
                <Alert severity="success" onClose={handleCloseAlert}>
                  {message}
                </Alert>
              )}
            </Snackbar>
          )}
          {/* {upcomingEvents.length > 0 && (
            <div>
              <div className='align' style={{display: 'flex', marginTop: '20px'}}>
              <StudentSearchBar
          
                />
              <StudentToggle onToggleChange={handleToggleChange}/>
              </div>
              <div className='toggleTables'>
              {(selectedToggle === 'past' && eventHistory.length > 0) && (
                <>
                  <div className='total'>Past Events: {eventHistory.length}</div>
                  <EventHistory eventHistory={eventHistory} />
                </>
              )}
              {selectedToggle === 'upcoming' && (
                <>
                  <div className='total'>Upcoming Events: {upcomingEvents.length}</div>
                  <UpcomingEvents upcomingEvents={upcomingEvents} />
                </>
              )}
            </div>
            </div>
          )}
          {upcomingEvents.length === 0 && (
            <div>No available events</div>
          )} */}
        </div>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
                  <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            fontSize: 20,
          }}
        >
          <CancelIcon />
        </IconButton>
                  <div className='modalContent'>
          <AllTags tags={allTags} />
          <div className='buttonMiddle'>
            <Button variant='outlined' disableElevation sx={{
                borderColor: '#808080',
                color: '#666666',
                '&:hover': {
                  borderColor: '#777777',
                  backgroundColor: '#f0f0f0',
                },
                marginRight: '10px',
                marginBottom: '10px',
              }} onClick={() => handleCancel('tags')} >Cancel</Button>
            <Button variant='contained' disableElevation color='success' onClick={handleSaveTags} sx={{marginBottom: '10px', backgroundColor: '#45a049', '&:hover': { backgroundColor: '#3f8e41' }}}>Save</Button>
          </div>
        </div>
        </Dialog>
      </div>
    </div>
  );
}

export default OrganizationDetails;
