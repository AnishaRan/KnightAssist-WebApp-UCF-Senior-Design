const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const organizationSchema = require('../../models/organization');

router.get('/', async (req, res) => {
    try {
        const allOrganizations = await organizationSchema.find().select('name firstTimeLogin _id');
		console.log(allOrganizations)
        res.json(allOrganizations);
        console.log("All organizations fetched successfully ***");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
