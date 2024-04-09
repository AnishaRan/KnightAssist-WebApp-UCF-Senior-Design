const express = require('express');
const router = express.Router();

const Event = require('../../models/events');
const UserStudent = require('../../models/userStudent');

const generateRandomTimes = (start, end) => {
    let checkInTime;
    let checkOutTime;
    do {
        checkInTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        checkOutTime = new Date(checkInTime.getTime() + Math.random() * (2 * 60 * 60 * 1000)); // Random check out time within 2 hours
    } while (checkInTime.getTime() >= checkOutTime.getTime());

    return { checkInTime, checkOutTime };
};

router.post('/', async (req, res) => {
    try {
        const events = await Event.find({ sponsoringOrganization: "657e15abf893392ca98665d1" }).limit(5);

        for (const event of events) {
            const { checkInTime, checkOutTime } = generateRandomTimes(event.startTime, event.endTime);
            const studentId = '65616a1011a2035f14571238';
            const student = await UserStudent.findById(studentId);

            if (!student) {
                continue; // Skip if student not found
            }

            // Check if the user has already checked in
            const checkedInIndex = event.checkedInStudents.findIndex(checkIn => checkIn.studentId.equals(studentId));

            if (checkedInIndex === -1) { // Not checked in
                const volunteeringTimeMillis = checkOutTime - checkInTime;
                const volunteeringHours = volunteeringTimeMillis / 3600000;

                student.totalVolunteerHours += volunteeringHours;
                student.totalVolunteerHours = parseFloat(student.totalVolunteerHours.toFixed(2));

                const orgId = event.sponsoringOrganization.toString();

                let orgData = student.hoursPerOrg[orgId] || { hours: 0, numEvents: 0 };

                orgData.hours += volunteeringHours;
                orgData.hours = parseFloat(orgData.hours.toFixed(2));
                orgData.numEvents += 1;
                student.hoursPerOrg[orgId] = orgData;

                student.eventsHistory.push(event._id);

                const checkedInStudent = {
                    studentId,
                    checkInTime,
                    checkOutTime
                };

                await Event.updateOne(
                    { _id: event._id },
                    { $push: { checkedInStudents: checkedInStudent }, $addToSet: { attendees: studentId } }
                );
            } else { // Already checked in
                const updateField = {};
                updateField[`checkedInStudents.${checkedInIndex}.checkOutTime`] = checkOutTime;

                await Event.updateOne(
                    { _id: event._id, 'checkedInStudents.studentId': studentId },
                    { $set: updateField }
                );
            }

            // Mark the hoursPerOrg field as modified for Mongoose
            student.markModified('hoursPerOrg');
            await student.save();
        }

        res.send("Mock checked-in and checked-out students generated and added to the first " + events.length + " events.");
    } catch (error) {
        console.error('Error generating mock data:', error);
        res.status(500).send('Error generating mock data.');
    }
});

module.exports = router;
