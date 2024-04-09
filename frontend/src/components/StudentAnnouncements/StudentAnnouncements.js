import React, { useState, useEffect } from 'react';
import StudentHeader from '../StudentHome/StudentHeader.js';
import SearchBar from "./SearchBar.js";
import Filter from "./Filter.js";
import Announcements from "./Announcements.js";
import './Announcements.css';
import { buildPath } from '../../path.js';
import StudentTopBar from '../TopBar/StudentTopBar';
import { CircularProgress } from '@mui/material';



function NewAnn() {
  var [announcements, setAnnouncements] = useState([]);
  var [searchAnnouncement, setSearchAnnouncement] = useState(undefined);
  var [filterTerm, setFilterTerm] = useState("favorited");
  //var [favOrgs, setFavOrgs] = useState([]);
  var [favUpdates, setFavUpdates] = useState([]);
  var [finalFavUpdates, setFinalFavUpdates] = useState([]);

  // To get default as favorites
  const [callInitialFav, setCallInitialFav] = useState(1);


  /*const reverseSearchResults = () => {
  setSearchAnnouncement((prevResults) => [...prevResults].reverse());
};*/


  var url2 = buildPath(`api/loadAllOrganizations`);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFavoritedUpdates = async () => {
    //sessionStorage.setItem("ID", "6519e4fd7a6fa91cd257bfda");
    const authToken = sessionStorage.getItem("token");
    url2 = buildPath(`api/loadFavoritedOrgs?userID=${sessionStorage.getItem("ID")}`);
    try {
      let response = await fetch(url2, {
        method: "GET",
        headers: {"Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      });
      let res1 = await response.json();
	  console.log(res1)
      var favUpdates = [];
      //var tempFavUpdates = [];
      for(let org of res1) {
        if(org.updates.length !== 0) {
          //favUpdates.push({_id: org._id, orgName: org.name, update: org.updates});
          favUpdates = favUpdates.concat(
            org.updates.map(update => ({
              organizationID: org._id,
              name: org.name,
              title: update.title,
              content: update.content,
              date: update.date,
            })));
        }
      }
      console.log(favUpdates);
      
	  // Later updates should be shown first
      favUpdates = favUpdates.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      console.log(favUpdates);
      setFinalFavUpdates(favUpdates);
      setFavUpdates(favUpdates);
    } catch(e) {
      console.log("failed to fetch fav updates");
    }
  };
  

  const fetchAllUpdates = async () => {
    try {
      let response = await fetch(url2, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let res = await response.json();

      let updatesArray = [];

      for (let org of res) {
        try {
          var url3 = buildPath(
            `api/loadAllOrgAnnouncements?organizationID=${org._id}`
          );

          response = await fetch(url3, {
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
              name: org.name.trim(),
			  organizationID: org._id,
            }));

            updatesArray.push(...announcementsWithOrgName);
          } else {
            console.error("Invalid response from org updates API:", orgUpdates);
          }
        } catch (e) {
          console.error("Failed to fetch org updates:", e);
        }
      }
      //updatesArray.reverse();
      updatesArray.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAnnouncements(updatesArray);
    } catch (e) {
      console.error("API call failed:", e);
    }
  };

  const searchAnnouncements = (searchTerm) => {
    console.log(filterTerm);
  
    if (filterTerm === "favorited") {
      console.log("HEREE-------------------");
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
	  console.log(favUpdates);
      const filteredResults = favUpdates.filter((a) => {
        const title = a.title ? a.title.toLowerCase() : "";
        const organizationName = a.name
          ? a.name.toLowerCase()
          : "";
  
        const includesSearchTerm =
          title.includes(lowerCaseSearchTerm) ||
          organizationName.includes(lowerCaseSearchTerm);
  
        return includesSearchTerm;
      });
	  console.log(filteredResults);
      setSearchAnnouncement(filteredResults);
    } else {
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
    }
  };

  const filterAnnouncements = (filterTerm) => {

    const term = filterTerm.toLowerCase();
    setFilterTerm(term);

    let filteredAnnouncements = [...announcements];
	
    if (term !== "all") {
      if (term === "favorited") {
        console.log("favorited!!!");

        filteredAnnouncements = favUpdates.map(update => ({
          ...update,
        }));
		setSearchAnnouncement(filteredAnnouncements.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))));
      } else {
        filteredAnnouncements = filteredAnnouncements.filter((a) =>
          a.title && a.title.toLowerCase().includes(term)
        );
		setSearchAnnouncement(filteredAnnouncements.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))));
	}
    } else {
      console.log("All!!!");
	  console.log(filteredAnnouncements)
	  setSearchAnnouncement(filteredAnnouncements.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))));
    }

    
  };
  
  

  // New function to handle organization name filtering


  useEffect(() => {
	const getUpdates = async() => {
		await fetchAllUpdates();
		await fetchFavoritedUpdates();
		await setCallInitialFav(callInitialFav * -1);
	}

	getUpdates();
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
	if(callInitialFav === -1){
		filterAnnouncements("favorited");
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callInitialFav])

  return (
    <div className='spartan' id="studentAnnouncements">
      <StudentTopBar title="Updates"/>
	  <StudentHeader/>
      <div className="moveEverything">
        <div className="testing">
          <div className="announcementSection">
		  {(searchAnnouncement) ?

          <div style={{marginLeft: '12%'}}>
            <div className="topSection">
			  <Filter searchAnnouncements={searchAnnouncements} filterAnnouncements={filterAnnouncements} />
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
             <Announcements announcements={searchAnnouncement} />
          </div>
		  	: <div className='centerProgress'><CircularProgress/></div>}
        </div>
        </div>
      </div>
    </div>
  );
}

export default NewAnn;

