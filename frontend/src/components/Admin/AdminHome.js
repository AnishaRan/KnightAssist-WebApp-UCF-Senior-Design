import {useState, useEffect} from 'react';

import AdminHeader from './AdminHeader';
import './AdminHome.css';
import ToggleButton from './AdminTables/Toggle';
import SearchBar from './AdminTables/SearchBar';
import StudentTable from './AdminTables/StudentTable';
import AdminTopBar from './AdminTopBar';
import OrganizationTable from './AdminTables/OrgTable';
import { buildPath } from '../../path.js';

function AdminHome()
{

  const [selectedToggle, setSelectedToggle] = useState('student');
  const [allStudents, setAllStudents] = useState([]);
  const [allOrgs, setAllOrgs] = useState([]);
  const [students, setStudents] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [numOrgs, setNumOrgs] = useState(0);
  const [numStudents, setNumStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  // const [studentSearchResults, setStudentSearchResults] = useState('');
  

  const handleToggleChange = (newToggleValue) => {
    setSelectedToggle(newToggleValue);
    console.log(newToggleValue);
  };

  const getAllStudents = async () => {
    console.log("loading students");
    var url = buildPath(`api/loadAllStudentsData`);

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json",
        // "Authorization": `Bearer ${authToken}`
      },
      });
      let res = await response.json();
      setAllStudents(res);
      setStudents(res);
      setNumStudents(res.length);
    } catch(e) {
      console.log("Failed to fetch all students");
    }
  };

  const getAllOrgs = async () => {
    console.log("loading organizations");
    var url = buildPath(`api/loadAllOrganizationsData`);

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json",
        // "Authorization": `Bearer ${authToken}`
      },
      });
      let res = await response.json();
      setAllOrgs(res);
      setOrgs(res);
      setNumOrgs(res.length);
    } catch(e) {
      console.log("Failed to fetch all students");
    }
  };

  const searchUsers = (term) => {
    const lowerCaseSearchTerm = term.toLowerCase();

    if (term.trim() !== "") {
      if (selectedToggle === 'student') {
        const filteredStudents = allStudents.filter((student) => {
          const studentFirstName = student.firstName ? student.firstName.toLowerCase() : "";
          const studentLastName = student.lastName ? student.lastName.toLowerCase() : "";
          const studentEmail = student.email ? student.email.toLowerCase() : "";

          return (
            studentFirstName.includes(lowerCaseSearchTerm) ||
            studentLastName.includes(lowerCaseSearchTerm) ||
            studentEmail.includes(lowerCaseSearchTerm)
          );
        });

        setStudents(filteredStudents);
      } else if (selectedToggle === 'organization') {
        console.log("heree");
        const filteredOrgs = allOrgs.filter((org) => {
          const orgName = org.name ? org.name.toLowerCase() : "";
          const orgEmail = org.email ? org.email.toLowerCase() : "";

          return (
            orgName.includes(lowerCaseSearchTerm) ||
            orgEmail.includes(lowerCaseSearchTerm)
          );
        });

        setOrgs(filteredOrgs);
      }
    } else {
      setStudents(allStudents);
      setOrgs(allOrgs);
    }
  };
  
  



  useEffect(() => {
    getAllStudents();
    getAllOrgs();
  }, []);


    

    return(
      <div>
        <AdminTopBar/>
        <AdminHeader/>
        <div className='adminPage'>
            <div className='topFeatures'>
              <SearchBar
                searchTerm = {searchTerm}
                setSearchTerm = {setSearchTerm}
                searchUsers={searchUsers}
                selectedToggle={selectedToggle}
                allStudents={allStudents}
                allOrgs={allOrgs}
                setStudents={setStudents}
                setOrgs={setOrgs}
              />
              <ToggleButton onToggleChange={handleToggleChange}/>
            </div>
            <div className='toggleTables'>
              {selectedToggle === 'student' && (
                <>
                  <div className='total'>Total Students: {numStudents}</div>
                  <StudentTable students={students} getAllStudents={getAllStudents} />
                </>
              )}
              {selectedToggle === 'organization' && (
                <>
                  <div className='total'>Total Organizations: {numOrgs}</div>
                  <OrganizationTable orgs={orgs} getAllOrgs={getAllOrgs} />
                </>
              )}
            </div>
        </div>
        
      </div>
    );
};

export default AdminHome;