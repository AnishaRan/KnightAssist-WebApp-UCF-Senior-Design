import React, { useState, useEffect } from 'react';
import StudentHeader from '../StudentHome/StudentHeader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Settings.css'
import Header from '../OrgEvents/Header';
import OrgTopBar from '../OrgHome/OrgTopBar';
import { Box, CardContent, MenuItem, Select, Switch, Typography, CardMedia } from '@mui/material';
import { Card } from 'react-bootstrap';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function Customization(props){

	function changeFontType(e){
		if(e.target.value === "spartan")
			props.setFontType("spartan");
		else
			props.setFontType("arial");
    }

	function Header(){
		return (
			<div className='headerTxt'>
				Customization
			</div>
		)
	}

	function Appearence(){

		return (
			<div>
				<div className='subHeaderTxt'>Appearance</div>
			
      <CssBaseline />
      <div style={{ alignItems: 'center' }}>
		<FormControl className='spartan settingsItem'>
					<RadioGroup defaultValue={props.appearenceMode}>
						<FormControlLabel value="light" control={<Radio className={(props.appearenceMode === "light") ? "lightRadio" : "darkRadio"}/>} label="Light" onClick={() => {props.setAppearenceMode("light")}}/>
						<FormControlLabel value="dark" control={<Radio className={(props.appearenceMode === "light") ? "lightRadio" : "darkRadio"}/>} label="Dark"  onClick={() => {props.setAppearenceMode("dark")}}/>
					</RadioGroup>
				</FormControl>
      </div>
			</div>
		)
	}

	function FontChoice(){
		return (
			<div>
				<div className='subHeaderTxt'>Font Type</div>
				<FormControl className='spartan settingsItem' variant="standard" sx={{color: (props.appearenceMode === "light") ? "black" : "white", m: 1, minWidth: 120 }}>
					<Select
						defaultValue={props.fontType}
						onChange={(e) => changeFontType(e)}
						sx={{color: (props.appearenceMode === "light") ? "black" : "white"}}
					>
						<MenuItem value="spartan">Spartan</MenuItem>
						<MenuItem value="arial">Arial</MenuItem>
					</Select>
				</FormControl>
			</div>
		)
	}

	return(
		<div className='customizationSection'>
			<Header/>
			<div className='settingsSubSection'>
				<Appearence/>
			</div>
			<div className='settingsSubSection'>
				<FontChoice/>
			</div>
			<div>&nbsp;</div>
		</div>
	);
};

export default Customization;