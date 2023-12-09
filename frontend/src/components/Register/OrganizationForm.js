import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import React from "react";
import { Box } from '@mui/material';

export default function OrganizationForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  }

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
          />
        </Grid>
      </Grid>
    </Box>
  );
}