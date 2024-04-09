const express = require("express");
const router = express.Router();
const Event = require("../../models/events");
const UserStudent = require("../../models/userStudent");

router.post("/", async (req, res) => {
    try {
        const { qrCodeData_eventID_WithHash, studentId } = req.body;

        if (qrCodeData_eventID_WithHash.length <= 24 || !qrCodeData_eventID_WithHash.endsWith('out')) {
            return res.status(404).send("The QRCode is not a checkout code.");
        }

        const eventId = qrCodeData_eventID_WithHash.substring(0, 24);
        const eventObj = await Event.findById(eventId);

        if (!eventObj) {
            return res.status(404).send("Event not found in the database.");
        }

        const student = await UserStudent.findById(studentId);
        if (!student) {
            return res.status(404).send("Student not found in the database.");
        }

        const checkInRecord = eventObj.checkedInStudents.find(record => record.studentId.equals(student._id));
        if (!checkInRecord) {
            return res.status(400).send("Student did not check in for this event earlier.");
        } else if (checkInRecord.checkOutTime) {
            return res.status(400).send("Student already checked out of this event.");
        }

        checkInRecord.checkOutTime = new Date();
        const volunteeringTimeMillis = checkInRecord.checkOutTime - checkInRecord.checkInTime;
        const volunteeringHours = volunteeringTimeMillis / 3600000;

        student.totalVolunteerHours += volunteeringHours;
        // Round total volunteer hours to two decimal places
        student.totalVolunteerHours = parseFloat(student.totalVolunteerHours.toFixed(2));

        // Update hours and event count per organization
        const orgId = eventObj.sponsoringOrganization.toString();
        let orgData = student.hoursPerOrg[orgId] || { hours: 0, numEvents: 0 };

        orgData.hours += volunteeringHours;
        orgData.hours = parseFloat(orgData.hours.toFixed(2));
        orgData.numEvents += 1;

        student.hoursPerOrg[orgId] = orgData; // Update the data for the organization

        await eventObj.save();
        student.markModified('hoursPerOrg'); // Mark the hoursPerOrg field as modified
        student.eventsHistory.push(eventObj._id);
        await student.save();

        res.status(200).send({
            message: `Check-out successful. Volunteer hours updated for student ${student._id} for event ${eventId}.`,
            eventObj: eventObj
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
