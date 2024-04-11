import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RedoStudentProfile.css';
import { Snackbar, Alert, IconButton, Button, TextField, Avatar, Dialog, DialogContent, DialogTitle, Grid, Chip, Menu, MenuItem } from '@mui/material';
import { buildPath } from '../../path';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { TbEditCircle } from 'react-icons/tb';


function Account({info, fetchStudentInfo, resetPic, setResetPic})
{
    const [editMode, setEditMode] = useState(false);
    const [picName, setPicName] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [semesterGoal, setSemesterGoal] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [prevSelectedTags, setPrevSelectedTags] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [id, setId] = useState('');
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(true);
    const [openPicSelectChoice, setOpenPicSelectChoice] = useState(null);
    const profilePicSelect = useRef(null);
    const [picFile, setPicFile] = useState(undefined);
    const [openDefaultPFPModal, setOpenDefaultPFPModal] = useState(false);
    const [reset, setReset] = useState(false);
    const [defaultPFPs, setDefaultPFPs] = useState(undefined);

    function validateImgSelection(fileSelect){
		// No files selected
		if(fileSelect.current.files.length === 0) return false;
		
		const file = fileSelect.current.files[0].name;
		// console.log(file)

		const fileType = file.substring(file.lastIndexOf(".") + 1);

		return fileType === "png" || fileType === "gif" || fileType === "jpg" || fileType === "jpeg";
	}

	const openPicSelectMenu = (event) => {
	  setOpenPicSelectChoice(event.currentTarget);
	};
    
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    function handleEditModeToggle() {
        setMessage('');
        setOpenAlert(true);
        setEditMode((prevEditMode) => !prevEditMode);
    }
    function handleCancel() {
        setEditMode((prevEditMode) => !prevEditMode);
        setFirstName(info.firstName);
        setLastName(info.lastName);
        setEmail(info.email);
        setSemesterGoal(info.semesterVolunteerHourGoal);
        setPrevSelectedTags(info.categoryTags);
        setTags(info.categoryTags);
    }

    function handleCancelTags() {
        fetchStudentInfo();
        setOpenModal(false);
    }

    async function handleSave() {
        setEditMode((prevEditMode) => !prevEditMode);

        await handleSaveTags();
        
        const json = {
            id: sessionStorage.getItem("ID"),
            firstName: firstName,
            lastName: lastName,
            email: email,
            semesterVolunteerHourGoal: Math.round(Number(semesterGoal)),
            // categoryTags: newSelectedTags
        };

        console.log(json);
        try {
            const url = buildPath("api/editUserProfile");

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
				headers: {"Content-Type": "application/json",         
				"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
			});

            let res = await response.text();
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setSemesterGoal(semesterGoal);
            setTags(tags)
            setPrevSelectedTags(prevSelectedTags);

            let formData = new FormData();

            if(picFile){
                formData.append('profilePic', picFile); 
                formData.append('typeOfImage', '3');
                formData.append('id', sessionStorage.getItem("ID"));

                await fetch(buildPath(`api/storeImage`), {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
				
				setResetPic(!resetPic);
            }

            // setReset(!props.reset);
            if (response.status == 404) {
                setMessage("Error occured, could not save information");
                fetchStudentInfo();
  
              } else {
                setMessage("Information saved successfully");
              }
          
        } catch(e) {
            setMessage("Failed to save edited information.");
        }
    }

    async function getDefaultPFPs(){
		// All default pfps
		const pfps = [];

		for(let i = 1; i <= 11; i++){
			// Note: Link cannot be saved as variable, causes error
			pfps.push(
				<Avatar
					src={require('../OrgProfile/DefaultPFPs/pfp' + i + '.png')}
					className='defaultPFP addHover'
					onClick={async() => {
								setPicName(require('../OrgProfile/DefaultPFPs/pfp' + i + '.png')); 
								const response = await fetch(require('../OrgProfile/DefaultPFPs/pfp' + i + '.png'));
								const blob = await response.blob();
								const file = new File([blob], "profileImage.png", {
									type: blob.type,
								});
								setPicFile(file);
								setOpenDefaultPFPModal(false);
							}}
				/>
			)
		}

		setDefaultPFPs(pfps);
	}

    async function getProfilePic(){
		let id;

		if("viewingStudentPageID" in sessionStorage && 
			sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingStudentPageID")){
			id = sessionStorage.getItem("viewingStudentPageID");
		}else{
			id = sessionStorage.getItem("ID");
		}

		const url = buildPath(`api/retrieveImage?typeOfImage=3&id=${id}`);

		const response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});

		let pic = JSON.parse(await response.text());

		setPicName(pic.url);
	}

    function CreatedDate(){
        var date = new Date(info.createdAt);const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = date.toLocaleDateString('en-US', options);

		return (
            <div className='startedVolunteeringDate'><em>Volunteering Since {formattedDate}</em></div>
		)
	}

    async function handleEditTags() {
        console.log("edit tags clicked");
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

    async function handleSaveTags() {
        console.log("save");
        try {
            // Implement logic to save selected tags
            const json = {
              id: id,
              categoryTags: prevSelectedTags,
            };
        
            var url = buildPath(`api/editUserProfile`);
        
            var response = await fetch(url, {
              method: "POST",
              body: JSON.stringify(json),
              headers: {
                "Content-Type": "application/json",
              },
            });
        
            if (response.status === 200) {
                // setMessage("Tags saved successfully");
                setPrevSelectedTags(prevSelectedTags);
            } else {
                setMessage("Error occurred, could not save tags");
            }
        
            setOpenModal(false);
          } catch (e) {
            console.log("Error saving tags: ", e);
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

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    useEffect(() => {
        getProfilePic();
        getDefaultPFPs();
        console.log(info);
    }, []);

    useEffect(() => {
        console.log("Received info in Account component:", info);
        // Update component state based on received props
        if (info) {
            setFirstName(info.firstName || "");
            setLastName(info.lastName || "");
            setEmail(info.email || "");
            setSemesterGoal(info.semesterVolunteerHourGoal || 0);
            setTags(info.categoryTags);
            setPrevSelectedTags(info.categoryTags);
            setId(info._id);
        //     // Additional state updates based on received info
        }
    }, [info]);

    return(
        <>
        <div className='studentAccountTab' style={{backgroundColor: (sessionStorage.getItem("theme") === 'light') ? '#f9f9f9' : '#303030'}}>
            <div className='profileAvatarSettings'>
			<div className='picContainer'>
				<Avatar
					src={(picName) ? picName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
					className='picAvatar'
					sx={{ width: 100, height: 100, marginBottom: "16px", marginLeft: "-12%"}} 
				/>
				{(editMode) ? <TbEditCircle className="editIcon" onClick={openPicSelectMenu}/> : null}
				<Menu
					open={Boolean(openPicSelectChoice)}
					anchorEl={openPicSelectChoice}
					onClose={() => setOpenPicSelectChoice(null)}
				>
					<MenuItem onClick={() => {document.getElementById("profilepic").click(); setOpenPicSelectChoice(null);}}>Upload</MenuItem>
					<MenuItem onClick={() => {setOpenDefaultPFPModal(true); setOpenPicSelectChoice(null);}}>Select Default PFP</MenuItem>
				</Menu>
				<input ref={profilePicSelect} id="profilepic" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(profilePicSelect)){setPicName(URL.createObjectURL(profilePicSelect.current.files[0])); setPicFile(profilePicSelect.current.files[0]);}}}/>
			</div>
            </div>
            <div className='tabHeader'>Account Information</div>
            <div className='studentAccountFields'>
                <div className='accountFirstName'>
                    <div className='fieldName'>First Name</div>
                    <div className='accountTextfield'>
                    {editMode ? (
                        <TextField
                        size='small'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant='outlined'
                        defaultValue={firstName}
                        // sx={{backgroundColor: '#F1F1F1'}}
                        />
                        ) : (
                        <div className='accountFirstNameTextfield'>{firstName}</div>
                    )}
                    </div>
                    
                </div>
                <div className='accountLastName'>
                    <div className='fieldName'>Last Name</div>
                    <div className='accountTextfield'>
                        {editMode ? (
                            <TextField
                            size='small'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            variant='outlined'
                            defaultValue={lastName}
                            // sx={{backgroundColor: '#F1F1F1'}}
                            />
                            ) : (
                            <div className='accountLastNameTextfield'>{lastName}</div>
                        )}
                    </div>
                </div>
                <div className='accountEmail'>
                    <div className='fieldName'>Email</div>
                    <div className='accountTextfield'>
                        {editMode ? (
                            <TextField
                            size='small'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant='outlined'
                            defaultValue={email}
                            // sx={{backgroundColor: '#F1F1F1'}}
                            />
                            ) : (
                            <div className='accountEmailTextfield'>{email}</div>
                        )}
                    </div>
                </div>
                <div className='accountSemesterGoal'>
                    <div className='fieldName'>Semester Goal</div>
                    <div className='accountTextfield'>
                        {editMode ? (
                            <TextField
                            size='small'
                            value={semesterGoal}
                            onChange={(e) => setSemesterGoal(e.target.value)}
                            variant='outlined'
                            defaultValue={semesterGoal}
                            // sx={{backgroundColor: '#F1F1F1'}}
                            />
                            ) : (
                            <div className='accountSemesterVolunteerGoalTextfield'>{semesterGoal}</div>
                        )}
                    </div>
                </div>
                <div className='studentDetailsInterests' style={{ marginBottom: editMode ? '10px' : '15px' }}>
                    <div className='studentDetailsInterestsText'>Interests</div>
                    {prevSelectedTags?.length > 0 && (
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
            </div>
        </div>
        <div className='accountButtons'>
            {editMode ? (
                <div className='accountButtons'>
                    <Button sx={{marginRight: '5px',
                    borderColor: '#808080',
                    color: '#666666',
                    '&:hover': {
                      borderColor: '#777777',
                      backgroundColor: '#f0f0f0',
                    }}} variant="outlined" onClick={handleCancel} disableElevation>Cancel</Button>
                    <Button variant="contained" color='success' sx={{backgroundColor: '#45a049', '&:hover': { backgroundColor: '#3f8e41' }}} onClick={handleSave} disableElevation>Save</Button>
                </div>) : (
                    (sessionStorage.getItem("role") === "volunteer") ? <Button variant="contained" onClick={handleEditModeToggle} disableElevation>Edit</Button> : ""
            )}
            
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
        </div>
        </Dialog>

        <Dialog open={openDefaultPFPModal} onClose={() => {setOpenDefaultPFPModal(false);}}>
					<DialogContent className='spartan pfpModal'>
						<Grid container justifyContent="center" alignItems="center" layout={'row'}>
							<DialogTitle className='dialogTitle'>Select a Profile Picture</DialogTitle>
							<div className='tagSection'>
								{defaultPFPs}
							</div>
						</Grid>
					</DialogContent>
				</Dialog>
        </>
    );
};

export default Account;
