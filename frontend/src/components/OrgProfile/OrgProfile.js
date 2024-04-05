import { useState, useEffect, useRef } from 'react';
import Header from '../OrgEvents/Header';
import StudentHeader from '../StudentHome/StudentHeader'
import './OrgProfile.css';
import OrgTopBar from '../OrgHome/OrgTopBar';
import { CardMedia } from '@mui/material';
import { buildPath } from '../../path';
import NavTabs from './NavTabs';
import OrgBox from './OrgBox';
import SearchResults from '../OrgEvents/SearchResults';
import { TbEditCircle } from 'react-icons/tb';
import StudentTopBar from '../TopBar/StudentTopBar';

function OrgProfile() {
	const [org, setOrg] = useState(null);
	const [bgFile, setBGFile] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [reset, setReset] = useState(false);

	const editInfo = useRef({});
	const backgroundSelect = useRef(null);

	async function getOrgInfo(){
        let organizationID;
		
		if("viewingPageID" in sessionStorage && 
		   sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingPageID")){
			organizationID = sessionStorage.getItem("viewingPageID");
		}else{
			organizationID = sessionStorage.getItem("ID");
		}
        
        let url = buildPath(`api/organizationSearch?organizationID=${organizationID}`);

        let response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
    
        let res = JSON.parse(await response.text());

		console.log(res);
		
		setOrg(res);

		url = buildPath(`api/retrieveImage?typeOfImage=4&id=${organizationID}`);

		response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});

		let background = JSON.parse(await response.text());

		setBGFile(background.url);
	}

	function validateImgSelection(fileSelect){
		// No files selected
		if(fileSelect.current.files.length === 0) return false;
		
		const file = fileSelect.current.files[0].name;
		console.log(file)

		const fileType = file.substring(file.lastIndexOf(".") + 1);

		return fileType === "png" || fileType === "gif" || fileType === "jpg" || fileType === "jpeg";
	}

	function BackgroundBanner(){
		return (
			<div className='picContainer'>
				<CardMedia
					component="img"
					image={(bgFile !== null) ? bgFile : ""}
					className={'orgBannerFiller picAvatar' + ((editMode) ? " blurBanner": "")}
				/>	
				{(editMode) ? <TbEditCircle className="editIconBanner" onClick={() => document.getElementById("background").click()}/> : null}
				<input ref={backgroundSelect} id="background" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(backgroundSelect)){setBGFile(URL.createObjectURL(backgroundSelect.current.files[0])); editInfo.current.background = backgroundSelect.current.files[0];}}}/>
			</div>
		)
	}

	useEffect(() => {
		getOrgInfo();
	
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getOrgInfo();
	
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset]);

	return (
		<div className='spartan'>
			{(sessionStorage.getItem("role") === "organization") ? <Header /> : <StudentHeader/>}
			{(sessionStorage.getItem("role") === "organization") ? <OrgTopBar title="Profile"/> : <StudentTopBar title="Profile"/>}
			<div className='orgProfilePage spartan'>
				{/* <div className='orgProfileTitle'>Organization Profile</div> */}
				{(org !== null)
					?	
					<div>
						<BackgroundBanner editMode={editMode}/>
						<OrgBox org={org} editMode={editMode} setEditMode={setEditMode} editInfo={editInfo} reset={reset} setReset={setReset}/>
						<div className='navTabs'>
							<NavTabs org={org} editMode={editMode} editInfo={editInfo}/>
						</div>
					</div>
					: ""
				}
			</div>
		
		</div>
	);
}

export default OrgProfile;
