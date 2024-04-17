const express = require('express');
const router = express.Router();

const event = require('../../models/events');

router.post('/', async (req, res) => {
    const searchID = req.body.organizationID;
    const eventID = req.body.eventID;

    await event.findOne({ sponsoringOrganization: searchID, _id: eventID }).then(async (events) => {
        console.log(events);
        if (events) {
            events.name = (req.body.name) ? req.body.name : events.name;
            // events.eventID = req.body.eventID;
            events.description = (req.body.description) ? req.body.description : events.description;
            events.location = (req.body.location) ? req.body.location : events.location;
            // events.date = req.body.date; [REMOVED AFTER WE AGREED THAT DATE IS TO BE SPLIT INTO START AND END TIME ONLY]
            events.sponsoringOrganization = (req.body.organizationID) ? req.body.organizationID : events.sponsoringOrganization; 
            events.startTime = (req.body.startTime) ? req.body.startTime : events.startTime;
            events.endTime = (req.body.endTime) ? req.body.endTime : events.endTime;
            events.eventLinks = (req.body.eventLinks) ? req.body.eventLinks : events.eventLinks;
            events.eventTags = (req.body.eventTags) ? req.body.eventTags : events.eventTags;
            events.semester = (req.body.semester) ? req.body.semester : events.semester;
            events.maxAttendees = (req.body.maxAttendees) ? req.body.maxAttendees : events.maxAttendees;
            events.save();            
            console.log(events);
			res.status(200).json({message: "Successful", ID: events._id});
        } else {
            res.status(404).send("Event not found in the database");
        }
    }).catch((err) => {
        res.status(503).send("Internal server error: " + err);
    });
});

module.exports = router;