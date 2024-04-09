const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Organization = require('../../models/organization');
const Event = require('../../models/events');
const UserStudent = require('../../models/userStudent'); 

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const intervalStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const user = await UserStudent.findById(userId);

		// Ensure that an existing not isn't pushed
		const messageSet = new Set();

		for(let i = 0; i < user.notifications.length; i++){
			let noto = user.notifications[i];

			// Delete notos for deleted events
			if(noto.type_is === "event"){
				let event = await Event.findById(noto.eventId);
				if(!event){
					user.notifications.splice(i, 1);
					i--;
					await user.save();
				}
			}

			messageSet.add(noto.message);
		}

        const favoriteOrgsUpdates = await Organization.find({
            favorites: userId,
            'updates.date': { $gt: intervalStart }
        }, 'name updates').lean();

        // Create notifications for updates from favorite organizations

		let newNotifications = [];

		for(let org of favoriteOrgsUpdates){
			for(let update of org.updates){
				newNotifications.push({
					message: `Update from ${org.name}: ${update.title}`,
					type_is: "orgAnnouncement",
					createdAt: `${update.date}`,
					eventId: "",
					orgId: org._id,
					updateContent: {
						updateID: update._id,
						title: update.title,
						content: update.content,
						organizationID: org._id,
						name: org.name
					},
					orgName: org.name,
					read: false
				})
			}
		}

        const favoriteOrgs = await Organization.find({ favorites: userId });

        for (let org of favoriteOrgs) {
            const events = await Event.find({
                sponsoringOrganization: org._id,
                createdAt: { $gt: intervalStart }
            });
			
			for(let event of events){
                newNotifications.push({
                    message: `Event from ${org.name}: ${event.name}`,
                    type_is: "event",
                    createdAt: event.createdAt, 
					eventId: event._id,
					orgId: org._id,
					updateContent: null,
					orgName: org.name,
                    read: false
                });
			}
        }

		newNotifications = newNotifications.filter((noto) => (!messageSet.has(noto.message)));

        // store new notifications to the user
        if (newNotifications.length > 0) {
            await UserStudent.findByIdAndUpdate(userId, {
                $push: { notifications: { $each: newNotifications } }
            });
        }

        // Refetch the user to get updated notifications
        const updatedUser = await UserStudent.findById(userId);

        // split notifications into new and old based on the read status and createdAt
        const segregatedNotifications = updatedUser.notifications.filter(notification =>notification.createdAt > intervalStart);
        const oldNotifications = updatedUser.notifications.filter(notification =>  notification.createdAt <= intervalStart);

        const response = {
            notifications: {
                new: segregatedNotifications.filter((noto) => noto.message).reverse().slice(0, 15),
                old: oldNotifications.filter((noto) => noto.message).reverse().slice(0, 15)
            }
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching updates, events, and storing notifications", error);
        res.status(500).send("Failed to fetch updates, events, and store notifications.");
    }
});

module.exports = router;
