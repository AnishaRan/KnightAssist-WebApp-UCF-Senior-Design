import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, Button, Alert, Snackbar, Dialog, IconButton, Avatar } from '@mui/material';
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
import OrgSearchBar from './OrgSearchBar.js';
import OrgToggle from './OrgToggle.js';
import PastEvents from './PastEvents.js';
import UpcomingEvents from './UpcomingEvents.js';


function OrganizationDetails({ organizationID }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
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
  const [tabSelected, setTabSelected] = useState('About');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [selectedOrgToggle, setSelectedOrgToggle] = useState('past');
  const [pastEvents, setPastEvents] = useState([]);
  const [totalPastEvents, setTotalPastEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [totalFutureEvents, setTotalFutureEvents] = useState([]);
  const [BGFile, setBGFile] = useState(null);
  const [PFPFile, setPFPFile] = useState(null);
  const [query, setQuery] = useState("");
  const [allUpcomingEvents, setAllUpcomingEvents] = useState([]);
  const [allPastEvents, setAllPastEvents] = useState([]);

  const handleOrgToggleChange = (newToggleValue) => {
    setSelectedOrgToggle(newToggleValue);
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
      setDescription(res.description);
      setPhoneNumber(res.contact?.phone || "");
      setLocation(res.location);
      setWebsite(res.contact?.website || "");
      setFacebook(res.contact?.socialMedia.facebook || "");
      setTwitter(res.contact?.socialMedia.twitter || "");
      setInstagram(res.contact?.socialMedia.instagram || "");
      setLinkedin(res.contact?.socialMedia.linkedin || "");

      console.log(id)
      console.log("finished events")
      // fetch past/upcoming events
      // fetchEventHistory(res._id);

      // get profile pic
      url = buildPath(`api/retrieveImage?typeOfImage=4&id=${organizationID}`);
      // pfp retrieveImage?entityType=organization&id=${organizationID}&profilePicOrBackGround=4

      try {
        response = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });

    
        let background = JSON.parse(await response.text());
        console.log(background);
        console.log(background.url);
    
        setBGFile(background.url);
        // pfp
        url = buildPath(`api/retrieveImage?typeOfImage=2&id=${organizationID}`);
  
        try {
          response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
          });
  
      
          let pfp = JSON.parse(await response.text());
          setPFPFile(pfp.url);
          console.log(pfp.url);
        } catch(e) {
          console.log("failed to get banner");
        }
      } catch(e) {
        console.log("failed to get banner");
      }

    } catch (e) {
      console.log('failed to fetch student info: ' + e);
    }
  };


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
        description: description,
        phone: phoneNumber,
        location: location,
        website: website,
        contact: {
          email: email,
          phone: phoneNumber,
          website: website,
          socialMedia: {
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            linkedin: linkedin
          }
        },


			}

			const url = buildPath(`api/editOrganizationProfile`);

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

  
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchOrganizationInfo();
  }, []);
  useEffect(() => {
    // Check if the id is populated, then call getPastEvents
    if (id) {
      getPastEvents(id);
    }
  }, [id]);

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

  const handleTabChange = (newValue) => {
    // Do something with the new value received from TabsOrg
    console.log(newValue);
    // You can update the state or perform any other actions here
    setTabSelected(newValue);
  };


  async function getPastEvents() {
    

    const url = buildPath(`api/searchEvent?organizationID=${id}`);

    const response = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });

    const res = JSON.parse(await response.text());

    console.log(res);    

    const pastEvents = [];
    const futureEvents = [];

    for(let event of res){
      if(!eventIsUpcoming(event.startTime)) {
        const url = buildPath(`api/retrieveImage?entityType=event&id=${event._id}`);

        const response = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });

        let pic = await response.blob();
        pastEvents.push(event);

      }
      if(eventIsUpcoming(event.endTime)) {
        const url = buildPath(`api/retrieveImage?entityType=event&id=${event._id}`);

        const response = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });

        let pic = await response.blob();
        futureEvents.push(event);

      } 
    }
            
    // pastEvents.sort(function(a,b){ 
    //     return b.props.startTime.localeCompare(a.props.startTime)
    // });
    console.log(pastEvents);
    console.log(futureEvents);
    setPastEvents(pastEvents);
    setTotalPastEvents(pastEvents);
    setFutureEvents(futureEvents);
    setTotalFutureEvents(futureEvents);

    

}

function eventIsUpcoming(endTime) {
  const today = new Date();
  const eventEndDate = new Date(endTime);

  // Set the time part of today's date to midnight
  today.setHours(0, 0, 0, 0);

  return eventEndDate.getTime() >= today.getTime();
}

  const backgroundImageStyle = BGFile
    ? { backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px', }
    : {};

  const backgroundImageURL = BGFile;


  const searchEvents = (query) => {
    const lowerCaseSearchTerm = query.toLowerCase();
    console.log(query);

    if (query.trim() !== "") {
      console.log(query)
      console.log(selectedOrgToggle)
      if (selectedOrgToggle === 'past') {
        const filteredPast = totalPastEvents.filter((event) => {
          const eventName = event.name ? event.name.toLowerCase() : "";
        //   const studentEmail = student.email ? student.email.toLowerCase() : "";

          return (
            eventName.startsWith(lowerCaseSearchTerm) || eventName.includes(lowerCaseSearchTerm)
        //     studentEmail.includes(lowerCaseSearchTerm)
          );
        });

        setPastEvents(filteredPast);
      } else if(selectedOrgToggle === 'upcoming') {
        console.log("heree");
        const filteredUpcoming = totalFutureEvents.filter((event) => {
          const eventName = event.name ? event.name.toLowerCase() : "";
        //   const orgEmail = org.email ? org.email.toLowerCase() : "";

          return (
            eventName.startsWith(lowerCaseSearchTerm) || eventName.includes(lowerCaseSearchTerm)
        //     orgEmail.includes(lowerCaseSearchTerm)
          );
        });

        setFutureEvents(filteredUpcoming);
      }
    } else {
      console.log("empty query");
      setQuery('');
      setPastEvents(totalPastEvents);
      setFutureEvents(totalFutureEvents);
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
        <div className='pictures'>
          <div style={{ ...backgroundImageStyle, backgroundImage: `url(${backgroundImageURL})`, width: '100%', height: '250px', position: 'relative' }}>
            {BGFile && <img src={backgroundImageURL} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: '10px', }} />}
          </div>
        </div>
        <div className='organizationProfilePic'>
          <Avatar
            alt="Profile Picture"
            className="profilePicture"
            src={PFPFile}
            sx={{
              width: '150px', // Set the desired width
              height: '150px', // Set the desired height
              // transform: 'translateY(-50%)',
              // zIndex: 2, /* Ensure the profile picture is above the background */
              // border: '2px solid #fff',
            }}
          />
        </div>
        


        <div style={{marginTop: '100px'}}>
        <Tabs onTabChange={handleTabChange}/>
        </div>
        <div className='studentDetailsFields' style={{ marginTop: '3px' }} >
        {tabSelected === 'About' && (
          <>
          <div className='heading'>Bio</div>
          <div className='studentDetailsFirst' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsFirstText'>Name</div>
            {editMode ? (
              <TextField
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsFirstText'>{name}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Description</div>
            {editMode ? (
              <TextField
              size='small'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant='outlined'
              multiline
              sx={{ m: 1, width: '45ch', backgroundColor: '#F1F1F1' }}
              />
            ) : (
              <div className='orgDetailsDescriptionText'>{description}</div>
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
          <div className='heading'>Contact</div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Email</div>
            {editMode ? (
              <TextField
              size='small'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{email}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Phone Number</div>
            {editMode ? (
              <TextField
              size='small'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{phoneNumber}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Location</div>
            {editMode ? (
              <TextField
              size='small'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{location}</div>
            )}
          </div>
          <div className='heading'>Social Media</div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Website</div>
            {editMode ? (
              <TextField
              size='small'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{website}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Facebook</div>
            {editMode ? (
              <TextField
              size='small'
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{facebook}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Instagram</div>
            {editMode ? (
              <TextField
              size='small'
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{instagram}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>Twitter</div>
            {editMode ? (
              <TextField
              size='small'
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{twitter}</div>
            )}
          </div>
          <div className='studentDetailsEmail' style={{ marginBottom: editMode ? '10px' : '15px' }}>
            <div className='studentDetailsEmailText'>LinkedIn</div>
            {editMode ? (
              <TextField
              size='small'
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              variant='outlined'
              sx={{backgroundColor: '#F1F1F1'}}
              />
            ) : (
              <div className='studentDetailsEmailText'>{linkedin}</div>
            )}
          </div>

          <div>
          <div className='buttonMiddle'>
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
          </div>
            </>
        )}
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
        {tabSelected === 'Events' && (
          <>
            <div style={{display: 'flex'}}>
              <OrgSearchBar
                query = {query}
                setQuery = {setQuery}
                searchEvents={searchEvents}
                selectedToggle={selectedOrgToggle}
                allUpcomingEvents={futureEvents}
                allPastEvents={pastEvents}
                setAllUpcomingEvents={setFutureEvents}
                setAllPastEvents={setPastEvents}
              />
              <OrgToggle onToggleChange={handleOrgToggleChange}/>
            </div>
            {selectedOrgToggle === 'past' && (
              <PastEvents events={pastEvents}/>
            )}
            {selectedOrgToggle === 'upcoming' && (
              <UpcomingEvents events={futureEvents}/>
            )}
          </>
        )}
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
