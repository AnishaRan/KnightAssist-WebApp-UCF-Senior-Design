import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Logo from '../Logo';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { buildPath } from '../../path';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostVerifiedQuestions.css'
import { Facebook, HelpOutline, Instagram, LinkedIn, LocationCityOutlined, PhoneAndroid, Pin, PinDrop, PinDropOutlined, X } from '@mui/icons-material';
import PlaceIcon from '@mui/icons-material/Place';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { RiTwitterXFill } from 'react-icons/ri';
import { BiWorld } from 'react-icons/bi';
import { CardMedia, Dialog, DialogContent, DialogTitle, Menu, MenuItem, Tooltip, styled, tooltipClasses } from '@mui/material';
import { testReset } from '@mui/joy/Tooltip/Tooltip';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function PostVerifiedQuestions()
{
    //const [isVolunteerView, setIsVolunteerView] = useState(true);
	function makeColorsArray(){
		const colors = [];
		for(let i = 0; i < 50; i++)
			colors.push("default");

		return colors;
    }
	
    const [hourlyGoal, setHourlyGoal] = useState(0);
    const [tagNames, setTagNames] = useState([]);
    const [tags, setTags] = useState([]);
    const [colors, setColors] = useState(makeColorsArray());
    const [selectedTags, setSelectedTags] = useState([]);
	const [description, setDescription] = useState("");

	const [picName, setPicName] = useState(null);
	const [picFile, setPicFile] = useState(null);
	const [bgName, setBGName] = useState(null);
	const [bgFile, setBGFile] = useState(null);

	const [phone, setPhone] = useState("");
	const [website, setWebsite] = useState("");

	const [fb, setFB] = useState("");
	const [x, setX] = useState("");
	const [ig, setIG] = useState("");
	const [lIn, setlIn] = useState("");

	const [location, setLocation] = useState("");

	const [mondayStart, setMondayStart] = useState(undefined);
	const [tuesdayStart, setTuesdayStart] = useState(undefined);
	const [wednesdayStart, setWednesdayStart] = useState(undefined);
	const [thursdayStart, setThursdayStart] = useState(undefined);
	const [fridayStart, setFridayStart] = useState(undefined);
	const [saturdayStart, setSaturdayStart] = useState(undefined);
	const [sundayStart, setSundayStart] = useState(undefined);
	const [mondayEnd, setMondayEnd] = useState(undefined);
	const [tuesdayEnd, setTuesdayEnd] = useState(undefined);
	const [wednesdayEnd, setWednesdayEnd] = useState(undefined);
	const [thursdayEnd, setThursdayEnd] = useState(undefined);
	const [fridayEnd, setFridayEnd] = useState(undefined);
	const [saturdayEnd, setSaturdayEnd] = useState(undefined);
	const [sundayEnd, setSundayEnd] = useState(undefined);

	const [role, setRole] = useState(undefined);

    // State needed due to bug where tag names where undefined
    const [makeTags, setMakeTags] = useState([]);

	const [currentStep, setCurrentStep] = useState(0);
	const [steps, setSteps] = useState([]);

	const [openDefaultPFPModal, setOpenDefaultPFPModal] = useState(false);

	const backgroundSelect = useRef(null);
	const profilePicSelect = useRef(null);

	const [openPicSelectChoice, setOpenPicSelectChoice] = useState(null);
	const [defaultPFPs, setDefaultPFPs] = useState(undefined);
    
	const openPicSelectMenu = (event) => {
	  setOpenPicSelectChoice(event.currentTarget);
	};

	function handleClick(idx){
		if(colors[idx] !== "default"){
			selectedTags.splice(selectedTags.indexOf(tagNames[idx]), 1);
			colors[idx] = "default"; 
		}else{
			if(selectedTags.length < 10){
			selectedTags.push(tagNames[idx]);
			console.log(selectedTags);
			colors[idx] = "#5f5395";
			}
		}

		setSelectedTags(selectedTags);

		getAllTags();
    }

    async function getTagNames(){
		let url = buildPath(`api/getAllAvailableTags`);

		let response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});
	
		let res = JSON.parse(await response.text());

		setTagNames(res);

		setMakeTags(true);
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
				const isSelected = selectedTags.includes(name);
				return (
					<Chip
					label={name}
					className='tagChip'
					onClick={() => handleClick(idx)}
					sx={{backgroundColor: colors[idx], 
						color: isSelected ? 'white' : 'black',
						"&:hover": {
						backgroundColor: (colors[idx] === "default") ? "default" : "purple"
					}}}
					/>
				);
			})
		)
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

	async function submitVolunteer(){
		try{
			// Store picture
			if(picFile !== null && typeof picFile.name === "string"){
				let formData = new FormData();
				formData.append('profilePic', picFile); 
				formData.append('typeOfImage', '3');
				formData.append('id', sessionStorage.getItem("ID"));

				// Store the picture selected to be associated with the event
				await fetch(buildPath(`api/storeImage`), {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => console.log(data))
				.catch(error => console.error('Error:', error));
			}

			const json = 
			{
				id: sessionStorage.getItem("ID"),
				semesterVolunteerHourGoal: hourlyGoal,
				categoryTags: selectedTags,
			}

			const url = buildPath("api/editUserProfile");

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {"Content-Type": "application/json",         
				"Authorization": `Bearer ${sessionStorage.getItem("token")}`}
            });

            let res = await response.text();
            console.log(res);

			window.location.href="/#/studenthomepage"
		}catch(e){
			console.log(e);
		}
	}

	async function submitOrganization(){
		try{

			// Store pictures

			let formData = new FormData();
			formData.append('profilePic', picFile); 
			formData.append('typeOfImage', '2');
			formData.append('id', sessionStorage.getItem("ID"));

			await fetch(buildPath(`api/storeImage`), {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => console.error('Error:', error));

			if(bgFile !== null && typeof bgFile.name === "string"){
				formData = new FormData();
				formData.append('profilePic', bgFile); 
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

			const json = 
			{
				id: sessionStorage.getItem("ID"),
				description: description,
				location: location,
				contact: {
					phone: phone,
					website: website,
					socialMedia:{
						facebook: fb,
						twitter: x,
						instagram: ig,
						linkedin: lIn
					}
				},
				workingHoursPerWeek: {
					sunday: {
						start: sundayStart,
						end: sundayEnd
					},
					monday: {
						start: mondayStart,
						end: mondayEnd
					},
					tuesday: {
						start: tuesdayStart,
						end: tuesdayEnd
					},
					wednesday: {
						start: wednesdayStart,
						end: wednesdayEnd
					},
					thursday: {
						start: thursdayStart,
						end: thursdayEnd
					},
					friday: {
						start: fridayStart,
						end: fridayEnd
					},
					saturday: {
						start: saturdayStart,
						end: saturdayEnd
					}
				},
				categoryTags: selectedTags
			}

			const url = buildPath("api/editOrganizationProfile");

			const response = await fetch(url, {
				method: "POST",
				body: JSON.stringify(json),
				headers: {"Content-Type": "application/json",         
						"Authorization": `Bearer ${sessionStorage.getItem("token")}`
			},
				
			});

			let res = await response.text();
			console.log(res);

			window.location.href="/#/orghome"
		}catch(e){
			console.log(e);
		}
	}

    async function handleStepBtnVolunteer(){
		if(currentStep == 0){
			setCurrentStep(1);
		}else{ 
			setCurrentStep(0);
		}
    }

	async function handleBackBtn(){
		setCurrentStep(currentStep - 1);
    }

	async function handleRightBtn(){
		if(currentStep < 2){
			setCurrentStep(currentStep + 1);
		}else{ // It is on the last step
			submit();
		}
    }

	async function submit(){
		if(role === "volunteer"){
			submitVolunteer();
		}else{
			submitOrganization();
		}
	}

    function Header(){
		return(
			<div className='header'>
				Additional Questions <Logo theStyle="logoStyle"/>
			</div>
		);
    }

    function SemesterGoal(){
		return (
			<div>
				<Grid container justifyContent="center" alignItems="center" >
						<p className='goalQuestion'>What is your hourly volunteer goal?</p>
				</Grid>
				<Grid container justifyContent="center" alignItems="center" marginBottom={"40px"}>
					<TextField
						name={"Hourly Goal"}
						required
						label={"Hourly Goal"}
						multiline={false}
						onChange={(e) => {e.currentTarget.value = e.target.value.replace(/[\D\s]/, ''); setHourlyGoal(e.target.value)}}
						value={hourlyGoal}
					/>
				</Grid>
			</div>
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

	function Pictures(){
		return (
			<div className='profilePicSelect'>
				<Grid container justify="center" alignItems="center" marginBottom={"50px"}>
					{(role === "organization") ? 
						<CardMedia
							component="img"
							className='bgStyle'
							image={(bgName !== null) ? bgName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
						/>
						: ""
					}
					<Avatar
						src={(picName !== null) ? picName : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
						className={"picStyle " + ((role === "organization") ? "orgPicStyle" : "")}
						sx={{borderStyle: "solid", borderColor: "white"}}
					/>
					<button className="selectPPic btn btn-primary" onClick={openPicSelectMenu}>Select Profile Picture</button>
					<Menu
						open={Boolean(openPicSelectChoice)}
						anchorEl={openPicSelectChoice}
						onClose={() => setOpenPicSelectChoice(null)}
					>
						<MenuItem onClick={() => {document.getElementById("profilePic").click(); setOpenPicSelectChoice(null);}}>Upload</MenuItem>
						<MenuItem onClick={() => {setOpenDefaultPFPModal(true); setOpenPicSelectChoice(null);}}>Select Default PFP</MenuItem>
					</Menu>
					<input ref={profilePicSelect} id="profilePic" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(profilePicSelect)){setPicName(URL.createObjectURL(profilePicSelect.current.files[0])); setPicFile(profilePicSelect.current.files[0])}}}/>
					{(role === "organization") ? 
						<div>
							<label for="background" className="selectPPic btn btn-primary">Select Background</label>
							<input ref={backgroundSelect} id="background" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(backgroundSelect)){setBGName(URL.createObjectURL(backgroundSelect.current.files[0])); setBGFile(backgroundSelect.current.files[0])}}}/>
						</div>
						: ""
					}
				</Grid>
			</div>
		)
	}

	function Description(){
		return (
			<div className='descriptionArea'>
				<p className='tagQuestion'>Describe Your Organziation</p>
                <TextField
                    label="Description"
					className='descriptionBox'
                    multiline
                    minRows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
			</div>
		)
	}

	function Contact(){
		return (
			<div>
				<p className='tagQuestion'>Phone & Website</p>
				<Grid container justifyContent="center" alignItems="center" layout={'row'} className='socials'>
					<Grid item sx={{marginRight: "50px"}}>
						<TextField variant="standard" label={<PhoneAndroid/>} required={false} value={phone} onChange={(e) => setPhone(e.target.value)}/>
					</Grid>
					<Grid item>
						<TextField variant="standard" label={<BiWorld/>} required={false} value={website} onChange={(e) => setWebsite(e.target.value)}/>
					</Grid>
				</Grid>
			</div>
		)
	}

	function SocialMedia(){
		return (
			<div>
				<p className='tagQuestion'>Socials<Tooltip title={<div className='helpTT'>This must be the exact links as you see them (i.e. https://www.facebook.com/UCF)</div>}><HelpOutline className='helpLogo'/></Tooltip></p>
				<Grid container justifyContent="center" alignItems="center" layout={'row'} className='socials'>
					<Grid item sx={{marginRight: "50px"}}>
						<TextField variant="standard" label={<Facebook/>} required={false} value={fb} onChange={(e) => setFB(e.target.value)}/>
					</Grid>
					<Grid item>
						<TextField variant="standard" label={<RiTwitterXFill/>} required={false} value={x} onChange={(e) => setX(e.target.value)}/>
					</Grid>
				</Grid>
				<Grid container justifyContent="center" alignItems="center" marginBottom={"50px"} layout={'row'} className='socials'>
					<Grid item sx={{marginRight: "50px"}}>
						<TextField variant="standard" label={<Instagram/>} required={false} value={ig} onChange={(e) => setIG(e.target.value)}/>
					</Grid>
					<Grid item>
						<TextField variant="standard" label={<LinkedIn/>} required={false} value={lIn} onChange={(e) => setlIn(e.target.value)}/>
					</Grid>
				</Grid>
			</div>
		)
	}

	function Location(){
		return (
			<div>
				<p className='tagQuestion'>Where Are You Located</p>
				<Grid container justifyContent="center" alignItems="center" layout={'row'} className='socials'>
					<Grid item>
						<TextField variant="standard" label={<PlaceIcon/>} sx={{width: 300}}required={false} value={location} onChange={(e) => setLocation(e.target.value)}/>
					</Grid>
				</Grid>
			</div>
		)
	}

	function TimeSelector(props){
        return (
            <Grid sx={{marginLeft: 1, marginRight: 1, marginBottom: 1, width: 150}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
					<TimePicker label={props.label} onChange={props.onChange}/>
                </LocalizationProvider>                                      
            </Grid>      
        )
    }

	function Calendar(){
		return (
			<div>
				<p className='tagQuestion'>When are your Office Hours</p>
				<p className='smallText'>{"(Leave Blank if Unapplicable)"}</p>
				<Grid className='allDays'>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Sunday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setSundayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setSundayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Monday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setMondayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setMondayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Tuesday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setTuesdayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setTuesdayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Wednesday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setWednesdayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setWednesdayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Thursday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setThursdayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setThursdayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Friday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setFridayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setFridayEnd(e)})}
					</Grid>
					<Grid container justifyContent="right" alignItems="center" layout={'row'} className='times'>
						<p className='dayText'>Saturday:</p>
						{TimeSelector({label: "Start", onChange:(e) => setSaturdayStart(e)})}
						{TimeSelector({label: "End", onChange:(e) => setSaturdayEnd(e)})}
					</Grid>
				</Grid>
			</div>
		)
	}

    function AllTags(){
		return (
			<div>
				<p className='tagQuestion'>{(role === "volunteer") 
					? "Select up to 10 of the below interests" 
					: <div >Select up to 10 tags for your organization<br/><p className='smallText'>This helps connect your organization to volunteers interested in your causes</p></div>
					}
				</p>
				<div className='allTags'>
					{tags}
				</div>
			</div>
		)
    }

	async function getDefaultPic(){
		const url = buildPath(`api/retrieveImage?typeOfImage=4&id=${sessionStorage.getItem("ID")}`);

		const response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});

		let defaultBG = JSON.parse(await response.text());

		setBGName(defaultBG.url);
		setBGFile(defaultBG.url);
	}

    useEffect(()=>{
        if(sessionStorage.getItem("role") === "volunteer"){
			setRole("volunteer");
			setSteps(["Account Information", "User Interests"]);
		}else{
			getDefaultPic();
			setSteps(["Account Information", "Office Hours", "Organization Tags"]);
			setRole("organization");
		}

		getTagNames();
		getDefaultPFPs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    
    useEffect(()=>{
		getAllTags();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[makeTags])


    return(
      <div className='spartan pvq'>
		<Header/>
		<Stepper activeStep={currentStep} alternativeLabel className='stepper'>
			{steps.map((label, i) => (
				<Step key={label} completed={currentStep > i}>
					<StepLabel>{label}</StepLabel>
				</Step>
			))}
		</Stepper>
		{(currentStep === 0) 
			? 
				<div>
					<p className='tagQuestion'>Picture{(role === "organization") ? "s" : ""}</p>
					{Pictures()}
					{(role === "organization") ? Description() : ""}
					{(role === "organization") ? Contact() : ""}
					{(role === "organization") ? SocialMedia() : ""}
					{(role === "volunteer") ? SemesterGoal() : ""}				
				</div>

			:		
				null
		}
		{(role === "volunteer" && currentStep === 1)
			?
				<AllTags/>
			:
				null		
		}
		{(role === "organization" && currentStep === 1)
			?
				<div>
					{Location()}
					{Calendar()}
				</div>
			:
				null
		}
		{(currentStep === 2)
			?
				<AllTags/>
			:
				null
		}
		{(role === "volunteer") ? <button type="button" class="stepBtn btn btn-primary" onClick={() => handleStepBtnVolunteer()}>{(currentStep == 0) ? "Next" : "Back"}</button> : null}
		{(role === "volunteer" && currentStep === 1) ? <button type="button" class="submitBtn btn btn-primary" onClick={() => submit()}>Submit</button> : ""}
		{(role === "organization" && currentStep > 0) ? <button type="button" class="stepBtn btn btn-primary" onClick={() => handleBackBtn()}>Back</button> : null}
		{(role === "organization") ? <button type="button" class="submitBtn btn btn-primary" onClick={() => handleRightBtn()}>{(currentStep < 2) ? "Next" : "Submit"}</button> : ""}
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
    );
};

export default PostVerifiedQuestions;
