import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RedoStudentProfile.css';
import StudentHeader from '../StudentHome/StudentHeader';
import StudentTopBar from '../TopBar/StudentTopBar';
import StudentProfileTabs from './StudentProfileTabs';
import Header from '../OrgEvents/Header';
import OrgTopBar from '../OrgHome/OrgTopBar';


function RedoStudentProfile()
{
	const [resetPic, setResetPic] = useState(false);

    return(
        <div className='fontFamily'>
            <div className='redoStudentProfile'>
				{(sessionStorage.getItem("role") === "volunteer") ? <StudentHeader/> : <Header/>}
				{(sessionStorage.getItem("role") === "volunteer") ? <StudentTopBar title="Profile" resetPic={resetPic}/> : <OrgTopBar title="Profile"/>}
				<div className="redoStudentProfileContent">
					<StudentProfileTabs setResetPic={setResetPic} resetPic={resetPic}/>
				</div>
            </div>
        </div>
    );
};

export default RedoStudentProfile;
