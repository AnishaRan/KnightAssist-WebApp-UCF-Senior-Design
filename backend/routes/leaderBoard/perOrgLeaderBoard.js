const express = require('express');
const router = express.Router();
const UserStudent = require('../../models/userStudent');
const Organization = require('../../models/organization');

router.get('/', async (req, res) => {
    try {
        const orgId = req.query.orgId;

        // Check if the organization exists
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(404).send('Organization not found in the database.');
        }

        // Fetch students who have volunteer hours recorded for any organization
        const students = await UserStudent.find({ 'hoursPerOrg': { $exists: true } })
            .select('firstName lastName hoursPerOrg eventsHistory totalVolunteerHours');

        // Filter students by those who have volunteered for the specific organization
        let volunteerDetails = students.filter(student => student.hoursPerOrg && student.hoursPerOrg[orgId])
            .map(student => {
                // Access the organization data directly from the object using orgId as the key
                let orgData = student.hoursPerOrg[orgId] || { hours: 0, numEvents: 0 };
                return {
                    _id: student._id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    // Use the specific volunteer hours and number of events for this organization
                    totalVolunteerHours: orgData.hours,
                    numEvents: orgData.numEvents
                };
            });

        // Sort the array based on hours volunteered in descending order
        volunteerDetails.sort((a, b) => b.totalVolunteerHours - a.totalVolunteerHours);

        res.json({
            success: true,
            message: 'Students ranked by total volunteer hours for the organization',
            data: volunteerDetails
        });
    } catch (error) {
        console.error('Internal error: ', error);
        res.status(500).send('Internal server error while making the per org leaderboard.');
    }
});

module.exports = router;
