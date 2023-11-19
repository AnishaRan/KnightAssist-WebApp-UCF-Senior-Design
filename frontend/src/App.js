import React from 'react';
import './App.css';
import "@fontsource/league-spartan";
import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import OrgPortalPage from './pages/OrgPortalPage';
import LandingPage from './pages/LandingPage';
import StudentHomePage from './pages/StudentHomePage';
import StudentExplorePage from './pages/StudentExplorePage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import StudentAnnouncementsPage from './pages/StudentAnnouncementsPage';
import StudentProfile from './components/StudentProfile/StudentProfile';

function App() 
{
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/login" element={<LoginPage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/orgportal" element={<OrgPortalPage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/studenthomepage" element={<StudentHomePage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/explore" element={<StudentExplorePage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/studentprofile" element={<StudentProfile/>}></Route>
          </Routes>
          <Routes>
            <Route path="/emailverified" element={<EmailVerifiedPage/>}></Route>
          </Routes>
          <Routes>
            <Route path="/studentannouncements" element={<StudentAnnouncementsPage/>}></Route>
          </Routes>
       </Router>
      </header>
    </div>
  );
}

export default App;