import { useState, useEffect, useRef } from 'react';
import Header from '../OrgEvents/Header';
import './OrgProfile.css';
import OrgTopBar from '../OrgHome/OrgTopBar';
import Card from '@mui/material/Card';
import { Button, Typography, CardContent, Avatar, TextField, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Grid, Chip, Menu, MenuItem, Tooltip, styled, tooltipClasses } from '@mui/material';
import { buildPath } from '../../path';
import NavTabs from './NavTabs';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CiCircleQuestion } from "react-icons/ci";
import {TbEditCircle} from "react-icons/tb";
import { Facebook, HeartBrokenOutlined, HelpOutline, Instagram, LinkedIn, QuestionMark, QuestionMarkOutlined, QuestionMarkRounded, QuestionMarkSharp, Star, StarOutline } from '@mui/icons-material';
import { RiEditCircleFill, RiTwitterXFill } from 'react-icons/ri';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

function OrgBox(props) {

	const [picName, setPicName] = useState(null);
	const [pic, setPic] = useState(null);
	const [role, setRole] = useState(null);
	const [favorited, setFavorited] = useState(false);

	const [newOrgName, setNewOrgName] = useState(undefined);
	const [newFB, setNewFB] = useState(undefined);
	const [newX, setNewX] = useState(undefined);
	const [newIG, setNewIG] = useState(undefined);
	const [newLIn, setNewLIn] = useState(undefined);
	const [newSelectedTags, setNewSelectedTags] = useState([]);

	const [expanded, setExpanded] = useState(false);

	// For modal purposes if they cancel
	const [tempFB, setTempFB] = useState(undefined);
	const [tempX, setTempX] = useState(undefined);
	const [tempIG, setTempIG] = useState(undefined);
	const [tempLIn, setTempLIn] = useState(undefined);
	const [tempSelectedTags, setTempSelectedTags] = useState([]);

	const [defaultPFPs, setDefaultPFPs] = useState(undefined);

	const [openPicSelectChoice, setOpenPicSelectChoice] = useState(null);
	
	const [openSocialsModal, setOpenSocialsModal] = useState(false);
	const [openInterestsModal, setOpenInterestsModal] = useState(false);
	const [openDefaultPFPModal, setOpenDefaultPFPModal] = useState(false);
    
	const openPicSelectMenu = (event) => {
	  setOpenPicSelectChoice(event.currentTarget);
	};

	// State needed due to bug where tag names where undefined
	const [makeTags, setMakeTags] = useState([]);

	const [tags, setTags] = useState([]);
	const [tagNames, setTagNames] = useState([]);
	const [colors, setColors] = useState([]);

	const profilePicSelect = useRef(null);

	const [heartHover, setHeartHover] = useState(false);

	const toggleExpanded = () => {
        setExpanded(!expanded);
    };

	async function submitEdits(){

		const editInfo = props.editInfo.current;

		console.log(newFB)

        const json = {
			id: sessionStorage.getItem("ID"),
            name: newOrgName,
			email: editInfo.email,
            description: editInfo.description,
			location: editInfo.location,
            contact: {
				email: editInfo.email,
				phone: editInfo.phone,
				website: editInfo.website,
				socialMedia: {
					facebook: newFB,
					twitter: newX,
					instagram: newIG,
					linkedin: newLIn
				}
			},
			workingHoursPerWeek:{
				sunday: editInfo.hours.sunday,
				monday: editInfo.hours.monday,
				tuesday: editInfo.hours.tuesday,
				wednesday: editInfo.hours.wednesday,
				thursday: editInfo.hours.thursday,
				friday: editInfo.hours.friday,
				saturday: editInfo.hours.saturday
			},
			categoryTags: newSelectedTags
        };

        console.log(json);

        const url = buildPath("api/editOrganizationProfile");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
				headers: {"Content-Type": "application/json",         
				"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
			});

            let res = await response.text();
            console.log(res);

			console.log(picName);

			let formData = new FormData();

			console.log(pic);

			if(pic !== null){
				formData.append('profilePic', pic); 
				formData.append('typeOfImage', '2');
				formData.append('id', sessionStorage.getItem("ID"));

				await fetch(buildPath(`api/storeImage`), {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => console.log(data))
				.catch(error => console.error('Error:', error));
			}

			if(editInfo.background){
				formData = new FormData();
				formData.append('profilePic', editInfo.background); 
				formData.append('typeOfImage', '4');
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

		if("viewingPageID" in sessionStorage && 
		    sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingPageID")){
			id = sessionStorage.getItem("viewingPageID");
		}else{
			id = sessionStorage.getItem("ID");
		}

		const url = buildPath(`api/retrieveImage?typeOfImage=2&id=${id}`);

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
					src={require('./DefaultPFPs/pfp' + i + '.png')}
					className='defaultPFP addHover'
					onClick={async() => {
								setPicName(require('./DefaultPFPs/pfp' + i + '.png')); 
								const response = await fetch(require('./DefaultPFPs/pfp' + i + '.png'));
								const blob = await response.blob();
								const file = new File([blob], "profileImage.png", {
									type: blob.type,
								});
								setPic(file);
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

	// Will add API call
	async function favoriteOrg(set){
		const organizationID = sessionStorage.getItem("viewingPageID");
		const userID = sessionStorage.getItem("ID");
		let url = buildPath(`api/searchForOrgInUserFavorites?userID=${userID}&organizationID=${organizationID}`);

		try {
			let response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});

			let res = JSON.parse(await response.text());

			const json = {
				organizationID: organizationID,
				userID: userID
			};

			console.log(res);
		
			setFavorited(res.favoriteStatus === 0);
	
			if(set){
				// Org is not a favorite of the user, add it
				if(res.favoriteStatus === 1){
					url = buildPath(`api/addFavoriteOrg`);
						
					response = await fetch(url, {
						body: JSON.stringify(json),
						method: "POST",
						headers: {"Content-Type": "application/json"},
					});
					
					res = await response.text();
	
					console.log(res);
			
					setFavorited(true);
				}else{// Remove as favorite
					url = buildPath(`api/removeFavoriteOrg`);
						
					response = await fetch(url, {
						body: JSON.stringify(json),
						method: "DELETE",
						headers: {"Content-Type": "application/json"},
					});
					
					res = await response.text();
	
					console.log(res);
			
					setFavorited(false);
				}
			}

		} catch(e) {
			console.log("error");
		}


	}

	// If user closes edit social modal without saving
	function resetSocials(){
		setTempFB(newFB);
		setTempX(newX);
		setTempIG(newIG);
		setTempLIn(newLIn);
		setOpenSocialsModal(false);
	}

	function saveSocials(){
		setNewFB(tempFB);
		setNewX(tempX);
		setNewIG(tempIG);
		setNewLIn(tempLIn);
		setOpenSocialsModal(false);
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
					src={(picName !== null) ? picName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
					className='picAvatar'
					sx={{ width: 100, height: 100, marginBottom: "16px", marginLeft: "-12%"}} 
				/>
				{(props.editMode) ? <TbEditCircle className="editIconOrg" onClick={openPicSelectMenu}/> : null}
				{(role === "volunteer") ? <div><Tooltip title={(favorited) ? "Unfavorite" : "Favorite"} placement='right'><BsHeartFill size="28px" className="heartIconBehind"/> {((heartHover) ? <BsHeartFill size="26px" className="heartIcon hoverHeart" onClick={() => favoriteOrg(true)} onMouseLeave={() => setHeartHover(false)}/> : <BsHeartFill size="26px" className={"heartIcon " + ((favorited) ? "redHeart" : "whiteHeart")} onMouseOver={() => setHeartHover(true)}/>)}</Tooltip></div> : null}
				<Menu
					open={Boolean(openPicSelectChoice)}
					anchorEl={openPicSelectChoice}
					onClose={() => setOpenPicSelectChoice(null)}
				>
					<MenuItem onClick={() => {document.getElementById("profilepic").click(); setOpenPicSelectChoice(null);}}>Upload</MenuItem>
					<MenuItem onClick={() => {setOpenDefaultPFPModal(true); setOpenPicSelectChoice(null);}}>Select Default PFP</MenuItem>
				</Menu>
				<input ref={profilePicSelect} id="profilepic" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(profilePicSelect)){setPicName(URL.createObjectURL(profilePicSelect.current.files[0])); setPic(profilePicSelect.current.files[0]);}}}/>
			</div>
		)
	}

	function OrgName(){
		return (
			(props.editMode === false)
				?
					<div className='orgName'>{props.org.name}</div>
				:
					<TextField className='orgNameEdit' variant="standard" label={"Organization Name"} required={false} value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)}/>
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

	function SocialMedia(){
		const socials = props.org.contact;
		return (
			(socials && socials.socialMedia) ?
				<div className='profileSocials'>
					{(socials.socialMedia.facebook) ? <a className='social' href={socials.socialMedia.facebook} target='_blank' rel="noopener noreferrer"><Facebook/></a> : ""}
					{(socials.socialMedia.twitter) ? <a className='social' href={socials.socialMedia.twitter} target='_blank'><RiTwitterXFill/></a> : ""}
					{(socials.socialMedia.instagram) ? <a className='social' href={socials.socialMedia.instagram} target='_blank'><Instagram/></a> : ""}
					{(socials.socialMedia.linkedin) ? <a className='social' href={socials.socialMedia.linkedin} target='_blank'><LinkedIn/></a> : ""}
				</div> 

				: ""
		)
	} 

	function EditSocials(){
		return (
		   <div>
				<button className='editSocialsBtn btn btn-primary' onClick={() => setOpenSocialsModal(true)}>Edit Socials</button>
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
			<Card className='tag'>
				<div className='addSpace'>
					{props.tag}
				</div>
			</Card>
        )
    }

	function Interests(){
		let end = (expanded) ? props.org.categoryTags.length : 2;
		return (
			<div className='interests'>
				<div className='interestsName'>Interests</div>
				<div className='tags'>
					{props.org.categoryTags.slice(0, end).map(t => <Tag tag={t}/>)}
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
			if(!props.org.categoryTags.includes(allTags[i])){
				tagColors.push("default"); 
			}else{
				tagColors.push("#5f5395");
			}
		}

		setNewSelectedTags(props.org.categoryTags.slice());
		setTempSelectedTags(props.org.categoryTags.slice());

		return tagColors;
	}

	useEffect(() => {
		setRole(sessionStorage.getItem("role"));
		getProfilePic();
		getDefaultPFPs();
		if(sessionStorage.getItem("role") === "volunteer")
			favoriteOrg(false);
	}, []);

	useEffect(() => {
		async function colorsAndTags(){
			setColors(await getColors());
			setMakeTags(true);
		}

		if(props.editMode){
			setNewOrgName(props.org.name);
			if(props.org.contact && props.org.contact.socialMedia){
				const socials = props.org.contact.socialMedia;
				setNewFB(socials.facebook);
				setNewX(socials.twitter);
				setNewIG(socials.instagram);
				setNewLIn(socials.linkedin);
				setTempFB(socials.facebook);
				setTempX(socials.twitter);
				setTempIG(socials.instagram);
				setTempLIn(socials.linkedin);
			}
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
		<div className={'spartan orgBox ' + ((sessionStorage.getItem("theme") === 'light') ? 'lightOrgBox' : 'darkOrgBox')}>
			<div className='items'>
				{(props.org !== null)
					?
						<div>
							{ProfilePic()}
							{OrgName()}
							
							{(role === "organization" && props.org._id === sessionStorage.getItem("ID")) 
								? EditSaveProfileBtn() 
								: null
							}
							{(!props.editMode) ? SocialMedia() : EditSocials()}	
							{(props.editMode)
								?
									EditInterests()
								: 
								 ((props.org.categoryTags.length > 0) ? Interests() : null)
							}
							{(props.org.categoryTags.length > 2)
								?
									!expanded && !props.editMode && (
										<Button onClick={toggleExpanded} color='primary' sx={{ alignSelf: 'flex-end', marginRight: '100px', textTransform: 'none'}}>
											See More
										</Button>
									)
								: ""
							}
							{(props.org.categoryTags.length > 2)
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

				<Dialog open={openSocialsModal} onClose={() => {resetSocials(); setOpenSocialsModal(false)}}>
					<DialogContent className='spartan feedbackModal'>
						<Grid container justifyContent="center" alignItems="center" layout={'row'}>
							<Grid item>
								<DialogTitle className='dialogTitle'>Edit Social Links<Tooltip title={<div className='helpTT'>This must be the exact links as you see them (i.e. https://www.facebook.com/UCF)</div>}><HelpOutline className='helpLogo'/></Tooltip></DialogTitle>
							</Grid>
						</Grid>
						<Grid container justifyContent="center" alignItems="center" layout={'row'} className='socials'>
							<Grid item sx={{marginRight: "50px"}}>
								<TextField variant="standard" label={<Facebook/>} required={false} value={tempFB} onChange={(e) => setTempFB(e.target.value)}/>
							</Grid>
							<Grid item>
									<TextField variant="standard" label={<RiTwitterXFill/>} required={false} value={tempX} onChange={(e) => setTempX(e.target.value)}/>
							</Grid>
						</Grid>
						<Grid container justifyContent="center" alignItems="center" marginBottom={"50px"} layout={'row'}>
							<Grid item sx={{marginRight: "50px"}}>
								<TextField variant="standard" label={<Instagram/>} required={false} value={tempIG} onChange={(e) => setTempIG(e.target.value)}/>
							</Grid>
							<Grid item>
								<TextField variant="standard" label={<LinkedIn/>} required={false} value={tempLIn} onChange={(e) => setTempLIn(e.target.value)}/>
							</Grid>
							<Button sx={{ mt: 8, mb: -2, width: 175, color: "white", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => saveSocials()}>Save</Button>
						</Grid>
					</DialogContent>
				</Dialog>

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

export default OrgBox;
