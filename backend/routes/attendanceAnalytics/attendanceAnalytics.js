const express = require('express');
const Organization = require('../../models/organization');
const Event = require('../../models/events');
const { default: mongoose } = require('mongoose');
const router = express.Router();
// GRAPH Dimensions
const width = 1100;
const height = 400;

// Mock ObjectId generator
const mockObjectId = () => Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);

// Mock data for testing
const mockEvents = [
    {
        _id: mockObjectId(),
        name: 'General Rock Trivia',
        registeredVolunteers: Array.from({ length: 50 }, mockObjectId),
        checkedInStudents: Array.from({ length: 30 }, mockObjectId),
        date: new Date(),
        sponsoringOrganization: 'someOrgId1',
    },
    {
        _id: mockObjectId(),
        name: 'Elton John Trivia',
        registeredVolunteers: Array.from({ length: 75 }, mockObjectId),
        checkedInStudents: Array.from({ length: 65 }, mockObjectId),
        date: new Date(),
        sponsoringOrganization: 'someOrgId1',
    },
    {
        _id: mockObjectId(),
        name: 'Beatles Trivia',
        registeredVolunteers: Array.from({ length: 58 }, mockObjectId),
        checkedInStudents: Array.from({ length: 22 }, mockObjectId),
        date: new Date(),
        sponsoringOrganization: 'someOrgId1',
    },
    {
        _id: mockObjectId(),
        name: `Karaoke Night #5`,
        registeredVolunteers: Array.from({ length: 69 }, mockObjectId),
        checkedInStudents: Array.from({ length: 53 }, mockObjectId),
        date: new Date(),
        sponsoringOrganization: 'someOrgId1',
    },
    {
        _id: mockObjectId(),
        name: `Billy Joel Trivia`,
        registeredVolunteers: Array.from({ length: 20 }, mockObjectId),
        checkedInStudents: Array.from({ length: 20 }, mockObjectId),
        date: new Date(),
        sponsoringOrganization: 'someOrgId1',
    }
];

router.get('/', async (req, res) => {
    try {
        // TO USE DUMMY DATA COMMENT THIS SECTION OUT AND UNCOMMENT THE DUMMY DATA ONE
        /* UNCOMMENT THIS TO USE ACTUAL DATABASE DATA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        const { orgId, limit } = req.query;

        const organization = await Organization.findById(orgId);

        if (!organization) {
            return res.status(404).send('Organization not found in the database');
        }

        // Find all events by this org
        let events = null;

        events = await Event.find({ sponsoringOrganization: new mongoose.Types.ObjectId(orgId) });
        events = events.filter((event) => new Date().toISOString().localeCompare((event.endTime.toISOString())) >= 0);

        // For debuggint to test with many events, will remove
        //events = events.concat(events);
        //events = events.concat(events);

		events.sort(function(a,b){ 
			return b.endTime.toISOString().localeCompare(a.endTime.toISOString())
		});

        if (limit)
            events = events.splice(0, 6);

        if (!events) {
            return res.status(404).send('No events found for this organization');
        }

        // /*
        //     @labels: event names
        //     @rsvpCountData: RSVP count
        //     @checkedInCountData: checked-in count
        // */
        const labels = [];
        const rsvpCountData = [];
        const checkedInCountData = [];

        // // go over each event that this org has and we collect the data
        for (const event of events) {
            labels.push(event.name);
            rsvpCountData.push(event.registeredVolunteers.length);
            checkedInCountData.push(event.checkedInStudents.length);
        }

        /* DUMMY DATA !!!!!!!!!!!!!!!!!!!!!*/
        /*const orgEvents = mockEvents.filter(event => event.sponsoringOrganization === 'someOrgId1');

        const labels = orgEvents.map(event => event.name);
        const rsvpCountData = orgEvents.map(event => event.registeredVolunteers.length);
        const checkedInCountData = orgEvents.map(event => event.checkedInStudents.length);*/
        /* DUMMY DATA */

        // we get the no show data 
        const noShowData = rsvpCountData.map((rsvp, index) => ((rsvp - checkedInCountData[index]) >= 0) ? (rsvp - checkedInCountData[index]) : 0);


        const chartCallback = (ChartJS) => {
            ChartJS.defaults.font.family = 'Arial';
            ChartJS.defaults.font.size = 16;
            ChartJS.defaults.color = '#666';
            ChartJS.defaults.plugins.tooltip.mode = 'index';
            ChartJS.defaults.plugins.tooltip.intersect = false;
        };


        const colorBlindColors = [
            'rgba(0, 158, 115, 0.5)',    // Sky Blue
            'rgba(0, 115, 179, 0.5)',    // Bluish Green
            'rgba(213, 94, 0, 0.5)',     // Vermilion
            'rgba(204, 121, 167, 0.5)'   // Orange-Pink
        ];

        const configuration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'RSVPed',
                        backgroundColor: 'rgba(0, 158, 115, 0.5)',
                        borderColor: 'rgba(0, 158, 115, 1)',
                        barPercentage: 0.7,
                        categoryPercentage: 0.5,
                        borderWidth: 1,
                        data: rsvpCountData,
                    },
                    {
                        label: 'Attended',
                        backgroundColor: 'rgba(0, 115, 179, 0.5)',
                        borderColor: 'rgba(0, 115, 179, 1)',
                        barPercentage: 0.7,
                        categoryPercentage: 0.5,
                        borderWidth: 1,
                        data: checkedInCountData,
                    },
                    {
                        label: 'No Show',
                        backgroundColor: 'rgba(213, 94, 0, 0.5)',
                        borderColor: 'rgba(213, 94, 0, 1)',
                        barPercentage: 0.7,
                        categoryPercentage: 0.5,
                        borderWidth: 1,
                        data: noShowData,
                    },
                    {
                        label: 'No Show Trend',
                        data: noShowData,
                        type: 'line',
                        borderColor: 'rgba(213, 94, 0, 1)',
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: 'rgba(213, 94, 0, 1)'
                    }
                ]
            },
        };

        res.json({ data: configuration.data });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
