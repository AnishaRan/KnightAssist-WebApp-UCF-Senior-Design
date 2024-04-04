const express = require("express");
const router = express.Router();

const orgDB = require("../../models/organization");

router.get('/', async (req, res) => {
    const organizationID = req.query.organizationID;

    try {
        console.log('Fetching announcements for organization ID to load its announcements:', organizationID);
        const organization = await orgDB.findOne({ _id: organizationID });
        if (!organization) return res.status(404).send('Organization not found in the database');

        const announcements = organization.updates.map(update => {
            return {
                title: update.title,
                content: update.content,
                date: update.date,
                updateID: update._id,
				organizationName: organization.name
            };
        });

        res.status(200).json({ announcements });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred - could not retrieve announcements');
    }
});

module.exports = router;
