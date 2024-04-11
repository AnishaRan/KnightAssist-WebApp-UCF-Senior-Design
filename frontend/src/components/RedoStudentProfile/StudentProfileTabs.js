import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Account from './Account';
import RecentEvents from './RecentEvents';
import FavoritedOrganizations from './FavoritedOrganizations';
import { buildPath } from '../../path';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function StudentProfileTabs(props) {
    const [value, setValue] = useState("1");
    const [studentInfo, setStudentInfo] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    async function fetchStudentInfo() {
        try {
            let studentID;
		
            if("viewingStudentPageID" in sessionStorage && 
               sessionStorage.getItem("ID") !== sessionStorage.getItem("viewingStudentPageID")){
                studentID = sessionStorage.getItem("viewingStudentPageID");
            }else{
                studentID = sessionStorage.getItem("ID");
            }

            let url = buildPath(`api/userSearch?userID=${studentID}`);

            let response = await fetch(url, {
                  method: "GET",
                  headers: {"Content-Type": "application/json",
                     "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                  }
            });
    
            let res = JSON.parse(await response.text());
            console.log(res);
            setStudentInfo(res);
        } catch(e) {
            console.log("Failed to retrieve student info");
        }
    }

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    return (
        <TabContext value={value}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                <Box>
                    <TabList orientation={isMobile ? 'horizontal' : 'vertical'} onChange={handleChange} aria-label="Student profile tabs">
                        <Tab sx={{alignItems: 'start'}} label="Account" value="1" />
                        {/* <Tab sx={{alignItems: 'start'}} label="Recent Events" value="2" /> */}
                        <Tab sx={{alignItems: 'start'}} label="Favorited Organizations" value="3" />
                    </TabList>
                </Box>
                <div style={{ flex: 1 }}>
                    <TabPanel value="1"><Account info={studentInfo} fetchStudentInfo={fetchStudentInfo} resetPic={props.resetPic} setResetPic={props.setResetPic} /></TabPanel>
                    {/* <TabPanel value="2"><RecentEvents /></TabPanel> */}
                    <TabPanel value="3"><FavoritedOrganizations/></TabPanel>
                </div>
            </div>
        </TabContext>
    );
}

export default StudentProfileTabs;
