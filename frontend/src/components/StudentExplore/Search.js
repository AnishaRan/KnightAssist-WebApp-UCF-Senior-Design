import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import './StudentExplore.css';
import { useState, useEffect } from 'react';
import { buildPath } from '../../path';

function Search(props) {
  
    const [events, setEvents] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [label, setLabel] = useState("Search For Events");
    const [options, setOptions] = useState(events);
	const [searchTerm, setSearchTerm] = useState("");

    function openOrgPage(id){
		sessionStorage.setItem("viewingPageID", id);
		window.location.href="/#/orgprofile";    
	}

	// Gets org name from organizationID
	async function getOrgName(id){
		let url = buildPath(`api/organizationSearch?organizationID=${id}`);

		let response = await fetch(url, {
			method: "GET",
			headers: {"Content-Type": "application/json"},
		});

		try{
			let res = JSON.parse(await response.text());
			return res.name;
		}catch{
			return -1;
		}
	}

	async function getAllEvents(flag){
        let url = buildPath(`api/loadAllEventsAcrossOrgs`);

        let response = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });

        let res = JSON.parse(await response.text());

        const tmp = [];

        for(let event of res){
            if("name" in event && "startTime" in event){
                tmp.push({label: event.name, id: event._id});
            }
        }

		console.log("done")

        setEvents(tmp);

        // Due to bug and since this function is only called
        // upon initialization
        if(flag === 1){
          setOptions(tmp);
		  props.results.current = tmp;
		}else{
          if(props.searchType !== "organizations")
            setOptions(tmp);
		}
    }

    async function getAllOrganization(){
        let url = buildPath('api/loadAllOrganizations');

        let response = await fetch(url, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });

        let res = JSON.parse(await response.text());

        const tmp = [];

        for(let org of res){
            if("name" in org && org.firstTimeLogin == false){
              tmp.push({label: org.name, id: org._id})
            }
        }
       
        setOrgs(tmp);
    }

	function handleClick(id){
        if(props.searchType === "events"){
            props.setEventID(id);
            props.setOpenEvent(true);
        }else{
			openOrgPage(id);
        }
    }

    useEffect(()=>{
        getAllEvents(1);
        getAllOrganization();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(()=>{
        if(props.searchType === undefined || events === undefined || orgs === undefined) return;

        if(props.searchType === "events"){
          setLabel("Search For Events");
          setOptions(events);
		  const filtered = events.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
		  props.results.current = filtered;
		  props.setSearchMode(false);
        }else{
          setLabel("Search For Organizations");
          setOptions(orgs);
		  props.setAllOrgs(orgs);
		  const filtered = orgs.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
		  props.results.current = filtered;
		  props.setSearchMode(true);
		  props.setResetSearchCards(props.resetSearchCards * -1);
		  props.setAllOrgsFlag(true);
        }
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.searchType]);

    useEffect(()=>{
		getAllEvents(0);
		if(props.searchMode)
			props.setResetSearchCards(props.resetSearchCards * -1);
		console.log(events);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.resetEventSearch])

	useEffect(() => {
		const filtered = options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));
		console.log(filtered);
		props.results.current = filtered;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm])

    return (
      <div>
        <Stack className="orgSearch" spacing={2} sx={{ width: 300 }}>
			<TextField label={label} onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						props.setSearchMode(true); 
						props.setResetSearchCards(props.resetSearchCards * -1);
					}
				}}
			/>
        </Stack>
      </div>

    );  
}

export default Search;
