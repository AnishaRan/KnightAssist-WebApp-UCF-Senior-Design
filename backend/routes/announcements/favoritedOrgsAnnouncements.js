const express = require("express");
const router = express.Router();

const orgDB = require("../../models/organization");
const userStudent = require("../../models/userStudent");

router.get('/', async (req, res) => {
    const studentID = req.query.studentID;

    const query = {};
    if (studentID) query._id = studentID;
    if (!studentID) return res.status(400).send('Student ID not provided to fetch for favorited orgs to get their announcements');

    try {
        console.log('Query:', query);
        const student = await userStudent.findOne( query );
        if (!student) return res.status(404).send('Student not found in the database');

        const favoritedOrgs = student.favoritedOrganizations;
        if (!favoritedOrgs) return res.status(404).send('Student has no favorited organizations');

        const announcements = [];
        for (let i = 0; i < favoritedOrgs.length; i++) {
            const org = await orgDB.findOne({ _id: favoritedOrgs[i] });
            if (!org) continue;
            const updates = org.updates;
            for (let j = 0; j < updates.length; j++) {
                announcements.push({
                    title: updates[j].title,
                    content: updates[j].content,
                    date: updates[j].date,
                    updateID: updates[j]._id,
                    organizationID: org._id,
                    organizationName: org.name
                });
            }
        }

        res.status(200).json({ announcements });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred - could not retrieve announcements');
    }
});

module.exports = router;

