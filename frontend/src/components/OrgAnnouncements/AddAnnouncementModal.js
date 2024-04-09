import { Modal } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CloseIcon from '@mui/icons-material/Close';
import { buildPath } from '../../path';
import { useState} from 'react';

function AddAnnouncementModal(props){
	const handleClose = () => {resetValues(); props.setOpen(false); props.setReset(!props.reset)}

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	function resetValues(){
		setTitle("");
		setContent("");
	}

	async function submit(){
        const json = {
            organizationID: sessionStorage.getItem("ID"), 
            title: title,
			content: content
        };

        const url = buildPath("api/createOrgAnnouncement");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {"Content-Type": "application/json"},
            });

            let res = await response.text();
            console.log(res);
			
            handleClose();
        }catch(err){
            console.log("An error has occurred: ", err);
        }
	}

	function GridTextField(props){
        return (
            <Grid item sx={(props.sx != null) ? props.sx : {}} xs={props.xs} sm={props.sm}>
                <TextField
                    name={props.name}
                    fullWidth
                    required={props.required}
                    label={props.label}
                    multiline={props.multiline}
                    minRows={props.minRows}
					maxRows={props.maxRows}
                    onChange={props.onChange}
                    value={props.value}
                />
            </Grid>
        )
    }

	return (
			<Modal sx={{display:'flex', alignItems:'center', justifyContent:'center', overflowY: 'none'}} open={props.open} onClose={handleClose}>
				<div className='center'>
					<Card className='announcementModalCard spartan'>
						<CardContent>
							<button className='closeAddEvent'>
								<CloseIcon onClick={() => handleClose()}/>
							</button>
							<Container component="main" maxWidth="xs">
								<Box className="boxStyle">		
									<Typography component="h1" variant="h5">
										Add Announcement
									</Typography>

									<Box component="form" noValidate sx={{ mt: 3 }}>
										<Grid container spacing={4} marginBottom={"40px"}>
											{GridTextField({xm:12, sm:12, name:"Title", label:"Title", required:true, multiline:false, value:title, onChange:(e) => setTitle(e.target.value)})}
											{GridTextField({xm:12, sm:12, name:"Content", label:"Content", required:true, multiline:true, minRows:10, maxRows: 10, value:content, onChange:(e) => setContent(e.target.value)})}                                
										</Grid>

										<Button
											fullWidth
											variant="contained"
											sx={{ mt: 3, mb: 2, color: 'white', backgroundColor: "#5f5395", "&:hover": {
												backgroundColor: "#7566b4"
											}}}
											onClick={() => submit()}
											>
											Add Announcement
										</Button>
									</Box>
								</Box>
							</Container>
						</CardContent>   
					</Card>
				</div>
			</Modal>	
		)
}

export default AddAnnouncementModal;