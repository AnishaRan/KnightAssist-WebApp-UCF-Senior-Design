import { useState, useEffect, useRef } from 'react';
import './StudentProfile';
import './StudentProfile.css';
import Card from '@mui/material/Card';
import { Button, Avatar, Dialog, DialogContent, DialogTitle, Grid, Chip, Menu, MenuItem } from '@mui/material';
import { buildPath } from '../../path';
import { TbEditCircle } from 'react-icons/tb';

function StudentBox(props) {

	const [picName, setPicName] = useState(undefined);
	const [picFile, setPicFile] = useState(undefined);
	const [role, setRole] = useState(null);
	const [newSelectedTags, setNewSelectedTags] = useState([]);

	const [openInterestsModal, setOpenInterestsModal] = useState(false);
	const [openDefaultPFPModal, setOpenDefaultPFPModal] = useState(false);
	
	const [openPicSelectChoice, setOpenPicSelectChoice] = useState(null);

	const [expanded, setExpanded] = useState(false);
	const [tempSelectedTags, setTempSelectedTags] = useState([]);

	// State needed due to bug where tag names where undefined
	const [makeTags, setMakeTags] = useState([]);

	const [tags, setTags] = useState([]);
	const [tagNames, setTagNames] = useState([]);
	const [colors, setColors] = useState([]);

	const profilePicSelect = useRef(null);

	const [defaultPFPs, setDefaultPFPs] = useState(undefined);
    
	const openPicSelectMenu = (event) => {
	  setOpenPicSelectChoice(event.currentTarget);
	};

	const toggleExpanded = () => {
        setExpanded(!expanded);
    };

	async function submitEdits(){

		const editInfo = props.editInfo.current;

        const json = {
			id: sessionStorage.getItem("ID"),
            firstName: editInfo.firstName,
			lastName: editInfo.lastName,
			email: editInfo.email,
			semesterVolunteerHourGoal: Math.round(Number(editInfo.goal)),
			categoryTags: newSelectedTags
        };

        console.log(json);

        const url = buildPath("api/editUserProfile");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
				headers: {"Content-Type": "application/json",         
				"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
			});

            let res = await response.text();
            console.log(res);

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
			}

			props.setReset(!props.reset);
        }catch(err){
            console.log("An error has occurred: ", err);
        }
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

	function handleClick(idx){
		if(colors[idx] !== "default"){
			tempSelectedTags.splice(tempSelectedTags.indexOf(tagNames[idx]), 1);
			colors[idx] = "default"; 
		}else{
			if(tempSelectedTags.length < 10){
				tempSelectedTags.push(tagNames[idx]);
				console.log(tempSelectedTags);
				colors[idx] = "#5f5395";
			}
		}

		setTempSelectedTags(tempSelectedTags);

		getAllTags();
    }

	async function getAllTags(){
		let url = buildPath(`api/getAllAvailableTags`);

		let response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});
	
		let res = JSON.parse(await response.text());

		setTags(
			res.map((name, idx) => {
				return (
					<Chip
						label={name}
						className='tagChip'
						onClick={() => handleClick(idx)}
						sx={{backgroundColor: colors[idx], 
							"&:hover": {
							backgroundColor: (colors[idx] === "default") ? "default" : "purple"
						}}}
					/>
				);
			})
		)
    }

	function validateImgSelection(fileSelect){
		// No files selected
		if(fileSelect.current.files.length === 0) return false;
		
		const file = fileSelect.current.files[0].name;
		console.log(file)

		const fileType = file.substring(file.lastIndexOf(".") + 1);

		return fileType === "png" || fileType === "gif" || fileType === "jpg" || fileType === "jpeg";
	}

	function ProfilePic(){
		return (
			<div className='picContainer'>
				<Avatar
					src={(picName) ? picName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
					className='picAvatar'
					sx={{ width: 100, height: 100, marginBottom: "16px", marginLeft: "-12%"}} 
				/>
				{(props.editMode) ? <TbEditCircle className="editIcon" onClick={openPicSelectMenu}/> : null}
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
		)
	}

	function JoinDate(){
		// Parse the ISO date string
		const joinedDate = new Date(props.user.updatedAt);

		// Format the date using toLocaleDateString
		const formattedDate = joinedDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		
		return (
			<div className='volunteerSince'>Volunteering since {formattedDate}</div>
		)
	}

	function EditSaveProfileBtn(){
		return (
		   <div>
			  {(props.editMode === false)
			  	?
					<button className='editBtn btn btn-primary' onClick={() => props.setEditMode(true)}>Edit Profile</button>
				:
					<button className='editBtn btn btn-primary' onClick={() => {submitEdits(); props.setEditMode(false);}}>Save Profile</button>
			  }
		   </div>
		)
	}

	function EditInterests(){
		return (
		   <div>
				<button className='editInterestsBtn btn btn-primary' onClick={() => setOpenInterestsModal(true)}>Edit Tags</button>
		   </div>
		)
	}

	function Tag(props){
        return (
			<Card className='studentTag'>
				<div className='addSpace'>
					{props.tag}
				</div>
			</Card>
        )
    }

	function Interests(){
		const end = (expanded) ? props.user.categoryTags.length : 2;

		return (
			<div className='studentInterests'>
				<div className='interestsName'>Interests</div>
				<div className='studentTags'>
					{props.user.categoryTags.slice(0, end).map(t => <Tag tag={t}/>)}
				</div>
			</div>
		)
	}
	
	function resetInterests(){
		setTempSelectedTags(newSelectedTags.slice(0)); 


		for(let i = 0; i < 50; i++){
			if(!newSelectedTags.includes(tagNames[i])){
				colors[i] = "default"; 
			}else{
				colors[i] = "#5f5395";
			}
		}

		setColors(colors);

		setOpenInterestsModal(false);
		console.log(colors);
	}

	async function getColors(){
		let url = buildPath(`api/getAllAvailableTags`);

		let response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});
	
		let allTags = JSON.parse(await response.text());

		setTagNames(allTags);

		const tagColors = [];

		for(let i = 0; i < 50; i++){
			if(!props.user.categoryTags.includes(allTags[i])){
				tagColors.push("default"); 
			}else{
				tagColors.push("#5f5395");
			}
		}

		setNewSelectedTags(props.user.categoryTags.slice());
		setTempSelectedTags(props.user.categoryTags.slice());

		return tagColors;
	}

	useEffect(() => {
		setRole(sessionStorage.getItem("role"));
		getProfilePic();
		getDefaultPFPs();
	}, []);

	useEffect(() => {
		if(props.user){
			getProfilePic();
		}
	}, [props.user]);


	useEffect(() => {
		async function colorsAndTags(){
			setColors(await getColors());
			setMakeTags(true);
		}

		if(props.editMode){
			colorsAndTags();
		}

	}, [props.editMode])

	useEffect(() => {
		getAllTags();
	}, [openInterestsModal])

	useEffect(() => {
		if(props.editMode){
			getAllTags();
		}
	}, [makeTags])

	return (
		<div className={'spartan studentBox ' + ((sessionStorage.getItem("theme") === 'light') ? 'lightOrgBox' : 'darkOrgBox')}>
			<div className='items'>
				{(props.user)
					?
						<div>
							{ProfilePic()}
							{JoinDate()}
							
							{(role === "volunteer" && props.user._id === sessionStorage.getItem("ID")) 
								? EditSaveProfileBtn() 
								: ""
							}
							{(props.editMode)
								?
									EditInterests()
								: 
								 ((props.user.categoryTags.length > 0) ? Interests() : null)
							}
							{(props.user.categoryTags.length > 2)
								?
									!expanded && !props.editMode && (
										<Button onClick={toggleExpanded} color='primary' sx={{ alignSelf: 'flex-end', marginRight: '100px', textTransform: 'none'}}>
											See More
										</Button>
									)
								: ""
							}
							{(props.user.categoryTags.length > 2)
								?
									expanded && !props.editMode && (
										<Button onClick={toggleExpanded} color='primary' sx={{ alignSelf: 'flex-end', marginTop: '8px', marginRight: '150px', textTransform: 'none', marginTop: '2px' }} >
											See Less
										</Button>
									)
								: ""
							}
						</div>
					: 
						""
				}

				<Dialog open={openInterestsModal} onClose={() => {resetInterests();}}>
					<DialogContent className='spartan tagModal'>
						<Grid container justifyContent="center" alignItems="center" layout={'row'}>
							<DialogTitle className='dialogTitle'>Edit Tags</DialogTitle>
							<div className='tagSection'>
								{tags}
							</div>
							<Button sx={{ mt: 8, width: 175, color: "white", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => {setNewSelectedTags(tempSelectedTags.slice(0)); setOpenInterestsModal(false);}}>Save</Button>
						</Grid>
					</DialogContent>
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
			</div>
		</div>
	);
}

export default StudentBox;
