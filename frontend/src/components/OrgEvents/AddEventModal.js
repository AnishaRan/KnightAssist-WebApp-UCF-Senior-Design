import { Modal } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Logo from '../Logo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import utc from 'dayjs/plugin/utc';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import './OrgEvents';
import { buildPath } from '../../path';
import { useEffect, useState, useRef} from 'react';

function AddEventModal(props)
{
    const handleClose = () => {resetValues(); props.setEditMode(0); props.setOpen(false);}

    const fileSelect = useRef();

    const [modalType, setModalType] = useState("Add");
    const [buttonText, setButtonText] = useState("Add");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("")
    const [startTime, setStartTime] = useState(undefined);
    const [endTime, setEndTime] = useState(undefined);
    const semester = "Fall 2023" //This will be implemented some other way later
    const [maxVolunteers, setMaxVolunteers] = useState();
    const [currentTag, setCurrentTag] = useState("");
    const [tags, setTags] = useState([]);
    const [tagNames, setTagNames] = useState([]);

	const [picName, setPicName] = useState(null);
	const [picFile, setPicFile] = useState(null);

    const [redoTags, setRedoTags] = useState(1);
    const [showError, setShowError] = useState(false);
	const [errors, setErrors] = useState([]);

    // Will eventually be an API call to get the tags of an org
    const [definedTags, setDefinedTags] = useState([]);

	// Event has not happened yet or is not over
    function eventIsUpcoming(endTime){
        return new Date().toISOString().localeCompare(endTime) < 0;
	}

	// Event ends after it starts
	function validTime(startTime, endTime){
		return new Date(startTime) < new Date(endTime);
	}

    async function resetValues(){
        setModalType("Add");
        setButtonText("Add");

        setName("");
        setDescription("");
        setLocation("");
		setPicName(null);
        setPicFile(null);
        setStartTime(undefined);
        setEndTime(undefined);
        setMaxVolunteers();
        setCurrentTag("");
        setTags([]);
        setTagNames([]);
        setShowError(false);

        setDefinedTags(await getOrgTags());
    }

	// Meant to fix time zone bugs
	function convertedTime(dateObj){
		let year, month, date, hour, min, sec;

		if(Number(dateObj.year()) < 10){
			year = "0" + dateObj.year();
		}else{
			year = dateObj.year();
		}

		if(Number(dateObj.month()) < 9){
			month = "0" + (dateObj.month() + 1);
		}else{
			month = (dateObj.month() + 1);
		}

		if(Number(dateObj.date()) < 10){
			date = "0" + dateObj.date();
		}else{
			date = dateObj.date();
		}

		if(Number(dateObj.hour()) < 10){
			hour = "0" + dateObj.hour();
		}else{
			hour = dateObj.hour();
		}

		if(Number(dateObj.minute()) < 10){
			min = "0" + dateObj.minute();
		}else{
			min = dateObj.minute();
		}

		if(Number(dateObj.second()) < 10){
			sec = "0" + dateObj.second();
		}else{
			sec = dateObj.second();
		}

		console.log(year+"-"+month+"-"+date+"T"+hour+":"+min+":"+sec)

		return new Date(year+"-"+month+"-"+date+"T"+hour+":"+min+":"+sec);
	}
    
    async function submitEvent(){
        console.log(tagNames);

		const formattedStart = convertedTime(dayjs(startTime));
		const formattedEnd = convertedTime(dayjs(endTime));

        const json = {
            name: name,
            description: description,
            location: location,
            sponsoringOrganization: sessionStorage.getItem("ID"),
            attendees: [],
            registeredVolunteers: [],
            startTime: formattedStart,
            endTime: formattedEnd,
            eventTags: tagNames,
            semester: semester,
            maxAttendees: maxVolunteers
        };

        const url = buildPath("api/addEvent");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {"Content-Type": "application/json"},
            });

            let res = JSON.parse(await response.text());
            console.log(res);

			if(picFile != null){
				const formData = new FormData();
				formData.append('profilePic', picFile); 
				formData.append('typeOfImage', '1');
				formData.append('id', res.ID);
	
				// Store the picture selected to be associated with the event
				await fetch(buildPath(`api/storeImage`), {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => console.log(data))
				.catch(error => console.error('Error:', error));
			}

            if(eventIsUpcoming(endTime))
                props.setReset(props.reset * -1);
            else
                props.setResetPast(props.resetPast * -1);

            props.setResetSearch(props.resetSearch * -1);

            handleClose();
        }catch(err){
            console.log("An error has occurred: ", err);
        }
    }

    async function editEvent(){

		const formattedStart = convertedTime(dayjs(startTime));
		const formattedEnd = convertedTime(dayjs(endTime));

        const json = {
            eventID: props.eventID,
            name: name,
            description: description,
            location: location,
            organizationID: sessionStorage.getItem("ID"),
            startTime: formattedStart,
            endTime: formattedEnd,
            eventTags: tagNames,
            semester: semester,
            maxAttendees: maxVolunteers
        };

        console.log(json);

        const url = buildPath("api/editEvent");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {"Content-Type": "application/json"},
            });

            let res = JSON.parse(await response.text());
            console.log(res);

			// For issue where images are blobs
			if(picFile != null && typeof picFile.name === "string"){
				const formData = new FormData();
				formData.append('profilePic', picFile); 
				formData.append('typeOfImage', '1');
				formData.append('id', res.ID);

				// Store the picture selected to be associated with the event
				await fetch(buildPath(`api/storeImage`), {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => console.log(data))
				.catch(error => console.error('Error:', error));
			}
            
            props.setEditMode(0);

			props.setReset(props.reset * -1);
			props.setResetPast(props.resetPast * -1);
            
            props.setResetSearch(props.resetSearch * -1);
            
            props.openEvent(true);

            resetValues();
            handleClose();
        }catch (err){
            console.log("An error has occurred: ", err);
        }
    }

    function validInput(){
		const errs = [];

        if(name === "" || description === "" || location === "" || maxVolunteers === "")
            errs.push("Some field(s) are empty!");

		if(!validTime(startTime, endTime))
			errs.push("Start date must be before end date");

		if(tagNames.length < 1)
			errs.push("At least one tag must be selected");

		if(errs.length == 0) return true;
		
		setShowError(true);
		setErrors(errs);

        return false;
    }

    function buttonEvent(){
        if(!validInput()){
            setShowError(true);
            return;
        }

        if(modalType === "Add")
            submitEvent();
        else
            editEvent();
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
                    onChange={props.onChange}
                    value={props.value}
                    error={showError && props.required && props.value === ""}
                />
            </Grid>
        )
    }

    function DateSelector(props){
        return(
            <Grid item xs={props.xs} sm={props.sm}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label={props.label} onChange={props.onChange}/>
                </LocalizationProvider>                                      
            </Grid>    
        )
    }

	function validateImgSelection(fileSelect){
		// No files selected
		if(fileSelect.current.files.length === 0) return false;
		
		const file = fileSelect.current.files[0].name;
		console.log(file)

		const fileType = file.substring(file.lastIndexOf(".") + 1);

		return fileType === "png" || fileType === "gif" || fileType === "jpg" || fileType === "jpeg";
	}

    function PhotoInput(props){
        return (
            <Grid item xs={props.xs} sm={props.sm}>
				<label for="upload" className="picBtn btn btn-primary">Select Pic</label>
				<div className='imgDemo'>
					{(picName != null) ? <img className="imgDemo" src={picName} alt=''/> : ""}
				</div>
                <input ref={fileSelect} id="upload" type="file" accept="image/*" style={{display:"none"}} onChange={() => {if(validateImgSelection(fileSelect)){setPicName(URL.createObjectURL(fileSelect.current.files[0])); setPicFile(fileSelect.current.files[0])}}}/>
            </Grid>
        )
    }

    function TimeSelector(props){
        return (
            <Grid item xs={props.xs} sm={props.sm}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateTimePicker label={props.label} value={props.value} onChange={props.onChange}/>
                </LocalizationProvider>                                      
            </Grid>      
        )
    }

    function Tag(props){
        return (
            <Grid item marginBottom={"-5px"}>
                <Card className='eventInterestAdd'>
                    <CloseIcon onClick={() => deleteTag(props.tag)}/>
                    {props.tag}
                </Card>
            </Grid>
        )
    }

    function ErrorMessage(){
        return (
            <div>
                {(showError) === true
                    ?
                        <div>
							{errors.map((err) => (
                            	<Alert severity="error">{err}</Alert>					
							))}
                        </div>
                    :
                        null
                }
            </div>
        )
    }

    function deleteTag(tag){        
        console.log(tagNames);
        let idx = tagNames.indexOf(tag);
        const taggy = tags.slice(0, idx).concat(tags.slice(idx + 1));
        setTags([...taggy]);
        const taggyNames = tagNames.slice(0, idx).concat(tagNames.slice(idx + 1));
        console.log(taggyNames)
        setTagNames([...taggyNames]);

        setDefinedTags(definedTags.concat(tag));

        setRedoTags(redoTags * -1);
    }   

    const createTag = () => {
		if(currentTag === "") return;
		
        setTags(tags.concat(<div>
            {Tag({"tag": currentTag})}
        </div>));

        setTagNames(tagNames.concat(currentTag));

        setCurrentTag("");
        let idx = definedTags.indexOf(currentTag);
        setDefinedTags(definedTags.slice(0, idx).concat(definedTags.slice(idx + 1)));

        setRedoTags(redoTags * -1);
    }

    const getOrgTags = async () => {
        const organizationID = sessionStorage.getItem("ID");
        const url = buildPath(`api/returnSingleOrgTags?organizationID=${organizationID}`);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            let res = JSON.parse(await response.text());
            console.log(res);

            return res;
            
        }catch (err){
            console.log("An error has occurred: ", err);
        }
    }

    useEffect(()=>{
        const setTags = async () => {
			setDefinedTags(await getOrgTags());
		}

		setTags();

		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        const addFields = async () => {
            let url = buildPath(`api/searchOneEvent?eventID=${props.eventID}`);

            let response = await fetch(url, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
        
            let res = JSON.parse(await response.text());

            let event = res[0];

            console.log(event);

            setModalType("Edit");
            setButtonText("Save Changes");
            
            setName(event.name);
            setDescription(event.description);
            setLocation(event.location);
            setStartTime(dayjs(event.startTime));
            setEndTime(dayjs(event.endTime));
            setMaxVolunteers(event.maxAttendees);
			
			url = buildPath(`api/retrieveImage?typeOfImage=1&id=${event._id}`);

			response = await fetch(url, {
				method: "GET",
				headers: {"Content-Type": "application/json"},
			});
	
			let pic = JSON.parse(await response.text());

			setPicName(pic.url);

            const taggy = [];
            const taggyNames = [];

            const unusedTags = definedTags;

            for(let tagName of event.eventTags){
                taggy.push(Tag({"tag": tagName}));
                taggyNames.push(tagName);

                // Make sure the available options are of tags not selected
                // for the event already
                unusedTags.splice(unusedTags.indexOf(tagName), 1);
            }
            
            setTags(taggy);
            setTagNames(taggyNames);

            setRedoTags(redoTags * -1);
        }

        if(props.editMode === 1)
            addFields();

		// eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.editMode]);

    // This is due to a bug that occurs when
    // deleting a tag, remakes all of the tags
    useEffect(() => {
        const updatedTags = [];
        const updatedTagNames = [];
 
        for(let str of tagNames){
            updatedTags.push(Tag({"tag": str}));
            updatedTagNames.push(str);
        }

        setTags(updatedTags);
        setTagNames(updatedTagNames);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redoTags])

    return(
        <Modal sx={{display:'flex', alignItems:'center', justifyContent:'center'}} open={props.open} onClose={handleClose}>
            <div className='center'>
                <Card className='addEventModalCard spartan'>
                    <CardContent>
                        <button className='closeAddEvent'>
                            <CloseIcon onClick={() => handleClose()}/>
                        </button>
                        <Container component="main" maxWidth="xs">
                            <Box className="boxStyle">
                            <Logo theStyle="logoHeader"/>
                            <Typography component="h1" variant="h5">
                                {modalType} Event
                            </Typography>

                            <Box component="form" noValidate sx={{ mt: 3 }}>
                                <div className='addEventHeader'>Event Info</div>
                                <Grid container spacing={2} marginBottom={"40px"}>
                                    {GridTextField({xm:12, sm:12, name:"Name", label:"Name", required:true, multiline:false, value:name, onChange:(e) => setName(e.target.value)})}
                                    {GridTextField({xm:12, sm:12, name:"Description", label:"Description", required:true, multiline:true, minRows:4, value:description, onChange:(e) => setDescription(e.target.value)})}                                
                                    {GridTextField({xm:12, sm:12, name:"Location", label:"Location", required:true, multiline:true, value:location, onChange:(e) => setLocation(e.target.value)})}
            
                                    {TimeSelector({xm:12, sm:6, label:"Start", value:startTime, onChange:(e) => setStartTime(e)})}  
                                    {TimeSelector({xm:12, sm:6, label:"End", value:endTime, onChange:(e) => setEndTime(e)})}  
                                    
									{GridTextField({xm:12, sm:5, name:"Max Volunteers", label:"Max Volunteers", required:true, multiline:true, type:"number", value:maxVolunteers, onChange:(e) => {e.currentTarget.value = e.target.value.replace(/[\D\s]/, ''); setMaxVolunteers(e.target.value)}})}

									{PhotoInput({xm:12, sm:6})}
                                </Grid>

                                <div className='addEventHeader'>Tags</div>
                                <Grid container spacing={2} marginTop={"65px"} marginBottom={"10px"}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-select-small-label">Select Tag</InputLabel>
                                            <Select
                                                value={currentTag}
                                                label="Select Tag"
                                                onChange={(e) => {console.log(e); setCurrentTag(e.target.value)}}
                                                sx={{fontSize:'large'}}

                                            >
                                                {definedTags.map((tag) => (
                                                    <MenuItem
                                                        key={tag}
                                                        value={tag}
                                                        size
                                                    >
                                                    {tag}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Button sx={{ mt: 3, mb: 4, ml: 3.5, width: 175, color: "white", backgroundColor: "#5f5395", "&:hover": {backgroundColor: "#7566b4"}}} variant="contained" onClick={() => createTag()}>Add Tag</Button>
                                    {tags}
                                </Grid>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, color: "white", backgroundColor: "#5f5395", "&:hover": {
                                        backgroundColor: "#7566b4",
                                      }}}
                                    onClick={() => buttonEvent()}
                                    >
                                    {buttonText}
                                </Button>

                                <ErrorMessage/>

                            </Box>
                            </Box>
                        </Container>
                    </CardContent>   
                </Card>
            </div>
        </Modal>
    );
};

export default AddEventModal;