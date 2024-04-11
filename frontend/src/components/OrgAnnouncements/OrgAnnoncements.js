import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar.js";
import Announcements from "./Announcements.js";
import { buildPath } from '../../path.js';
import {Button, CircularProgress } from '@mui/material';
import Header from '../OrgEvents/Header.js';
import OrgTopBar from '../OrgHome/OrgTopBar.js';
import AddAnnouncementModal from './AddAnnouncementModal.js';

function OrgAnn() {
  var [announcements, setAnnouncements] = useState([]);
  var [searchAnnouncement, setSearchAnnouncement] = useState(undefined);
  var [filterTerm, setFilterTerm] = useState("favorited");
  //var [favOrgs, setFavOrgs] = useState([]);
  var [favUpdates, setFavUpdates] = useState([]);
  var [finalFavUpdates, setFinalFavUpdates] = useState([]);
  const [openAnnouncement, setOpenAnnouncement] = useState(false);

  // For after you add an announcement
  const [reset, setReset] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllUpdates = async () => {
      
	let updatesArray = [];

	try {
		var url3 = buildPath(
		`api/loadOwnOrgAnnouncements?organizationID=${sessionStorage.getItem("ID")}`
		);

		let response = await fetch(url3, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		});

		let orgUpdates = await response.json();
		if (
		orgUpdates.announcements &&
		Array.isArray(orgUpdates.announcements)
		) {
		const announcementsWithOrgName = orgUpdates.announcements.map((announcement) => ({
			...announcement,
			organizationID: sessionStorage.getItem("ID"),
		}));

		updatesArray.push(...announcementsWithOrgName);
		} else {
		console.error("Invalid response from org updates API:", orgUpdates);
		}
	} catch (e) {
		console.error("Failed to fetch org updates:", e);
	}
	
	updatesArray.sort((a, b) => new Date(b.date) - new Date(a.date));

	setAnnouncements(updatesArray);
	setSearchAnnouncement(updatesArray);
  };

  const searchAnnouncements = (searchTerm) => {
	const lowerCaseSearchTerm = searchTerm.toLowerCase();

	const filteredResults = announcements.filter((a) => {
	const title = a.title ? a.title.toLowerCase() : "";
	const organizationName = a.name
		? a.name.toLowerCase()
		: "";

	const includesSearchTerm =
		title.includes(lowerCaseSearchTerm) ||
		organizationName.includes(lowerCaseSearchTerm);

	return includesSearchTerm;
	});

	setSearchAnnouncement(filteredResults);
  };

  useEffect(() => {
	const getUpdates = async() => {
		await fetchAllUpdates();
	}

	getUpdates();
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return (
    <div className='spartan' id="studentAnnouncements">
      <OrgTopBar title="Updates"/>
	  <Header/>
      <div className="moveEverything">
        <div className="testing">
          <div className="announcementSection">
          <div style={{marginLeft: '12%'}}>
            <div>
			  <div className='orgBarSpace'>
				<SearchBar
					searchAnnouncements={searchAnnouncements}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
					filterTerm={filterTerm}
					setFilterTerm={setFilterTerm}
					fetchAllUpdates={fetchAllUpdates}
					finalFavUpdates = {finalFavUpdates}
					setSearchAnnouncement={setSearchAnnouncement}
					initialAnnouncements={announcements}
				/>
			  </div>
			  <Button variant="contained" sx={{marginTop: 1.5, color: 'white', backgroundColor: '#5B4E77'}} className="addEventBtn" onClick={() => setOpenAnnouncement(true)}>
				Add Announcement
			  </Button>
			  <AddAnnouncementModal open={openAnnouncement} setOpen={setOpenAnnouncement} reset={reset} setReset={setReset}/>
            </div>
            {(searchAnnouncement) ? <Announcements announcements={searchAnnouncement} /> : <div className='centerProgress'><CircularProgress/></div>}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default OrgAnn;

