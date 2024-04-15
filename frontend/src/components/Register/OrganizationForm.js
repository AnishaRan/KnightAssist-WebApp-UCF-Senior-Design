import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { Box, Checkbox, Dialog, DialogContent, DialogContentText, FormControl } from '@mui/material';

export default function OrganizationForm(props) {
  const [openPolicyModal, setOpenPolicyModal] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    props.onSubmit({
      orgName: data.get('orgName'),
      email: data.get('email'),
      password: data.get('password'),
    });
  }

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   props.setOrgFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  return ( 
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            autoComplete="given-name"
            name="orgName"
            required
            fullWidth
            id="orgName"
            label="Organization Name"
            error={props.isOrgError.name}
            helperText={props.orgMessage.name}
            value={props.orgName}
            onChange={(e) => props.setOrgName(e.target.value)}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={props.isOrgError.email}
            helperText={props.orgMessage.email}
            value={props.orgEmail}
            onChange={(e) => props.setOrgEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            error={props.isOrgError.password}
            helperText={props.orgMessage.password}
            value={props.orgPass}
            onChange={(e) => props.setOrgPass(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="confirm password"
            label="Confirm Password"
            type="password"
            id="password"
            autoComplete="new-password"
            error={props.isOrgError.confirmPassword}
            helperText={props.orgMessage.confirmPassword}
            value={props.orgConfirmPassword}
            onChange={(e) => props.setOrgConfirmPassword(e.target.value)}
          />
        </Grid>
		<Grid item xs={12}>
			<FormControl sx={{float: "left"}}>
				<Checkbox
					sx={{'& .MuiSvgIcon-root': { fontSize: 28 }, float: "left", color: (!props.isOrgError.terms) ? '' : 'red', marginBottom: -3}}
					color='secondary'
					onClick={() => props.setTermsAccepted(!props.termsAccepted)}
				/>
			</FormControl>
			<div className='termsCheck'>Do you agree to the <a className="noSpacePP privatePolicy" onClick={() => setOpenPolicyModal(true)}>terms and conditions?</a> *</div>
		  </Grid>

		  <Dialog open={openPolicyModal} onClose={() => setOpenPolicyModal(false)}>
			<DialogContent className='feedbackModal'>
				<button className='closeAddEvent'>
                    <CloseIcon onClick={() => setOpenPolicyModal(false)}/>
                 </button>
				<DialogContentText className='contentWrap' style={{ color: 'black', fontSize: 25, marginBottom: 10, textAlign: 'center'}}>Terms & Conditions</DialogContentText>
				<DialogContentText className='contentWrap' style={{ color: 'black', marginTop: '10px', textAlign: 'justify' }}>
					{props.terms}
				</DialogContentText>
			</DialogContent>
		</Dialog>
      </Grid>
    </Box>
  );
}
