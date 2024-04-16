import React, { useState } from 'react';
import './EmailVerified.css';
import { BiMailSend  } from 'react-icons/bi';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { buildPath } from "../../path";
import PreLoginNavBar from '../../PreLogin/PreLoginNavBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useStyles from '../../PreLogin/PreLoginStyles';
import Alert from '@mui/material/Alert';

const theme = createTheme();

function StudentEmailVerified() {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const classes = useStyles();


  async function submitVerifyCode() {
    const url = buildPath("api/validateEmailTokenInput_student");
    // get STUDENT email

    const json = {
      userEmail: email,
      tokenEnteredByUser: verificationCode
    };

    console.log(json);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {"Content-Type": "application/json"},
      });

      let res = JSON.parse(await response.text());
      console.log(res);
      console.log(response);
      if(res.success) {
        setMessage("Correct code, please login");
        setIsSuccessful(true);
      } else if(!res.success) {
        setMessage("*Incorrect verification code, please enter again");
        setIsSuccessful(false);
      } else {
        setMessage("*Error occured");
        setIsSuccessful(false);
      }

    } catch(e) {
      console.log("oopsies");
      setMessage("*Error occured, email not found");
    }

  }

return (
        <div id='emailVerified'>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PreLoginNavBar />
            <div className="CardContainer">
              <Card variant="outlined" className="Card" style={{backgroundColor: "rgba(169, 169, 169, 0.05)"}}>
                <Box sx={{ margin: '20px' }}>
                  <div className="emailContent">Thanks for signing up! Please enter the confirmation code from your email to verify your account.</div>
                  <BiMailSend  className='verifyIcon'></BiMailSend >
                </Box>
                <TextField id="outlined-basic" label="Student Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} style={{ marginBottom: '10px'}} />
                <TextField id="outlined-basic" label="Verification Code" variant="outlined" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} />
                <Button className="submitBtn" variant="contained" color="primary" style={{ backgroundColor: '#5B4E77'}} onClick={submitVerifyCode}>
                  Submit
                </Button>
                {message && (
                  <Alert severity={isSuccessful ? "success" : "error"} sx={{marginBottom: '10px'}}>
                    {message}
                  </Alert>
                )}
              </Card>
            </div>
          </ThemeProvider>
        </div>
      );
    }

export default StudentEmailVerified;
