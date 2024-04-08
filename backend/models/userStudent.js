const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
// const organization = require('./organization');
// const Schema = mongoose.Schema;
// const UserStudent = require('./userStudent.js').schema;
// const Event = require('./events.js').schema;
// const OrganizationSemester = require('./organizationSemester.js').schema;
// const StudentSemester = require('./studentSemester.js').schema;
// const Organization = require('./organization.js').schema;


const userStudentSchema = new mongoose.Schema({
    /* To be added maybe: graduation date, major, etc. */
    /* NOTE -> We don't use this one anymore, we simply use the object ID attributed by mongoDB itself */
    // studentID: {
    //     type: String, // keeping it as string for now, maybe it makes things easier (alternative Int32)
    //     required: true,
    //     unique: true
    // },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'student'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicPath: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    favoritedOrganizations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization',
    }],
    eventsRSVP: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    }],
    eventsHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    }],
    totalVolunteerHours: {
        type: Number,
        required: true,
        default: 0
    },
    // hoursPerOrg: {
    //     type: Map,
    //     of: {},
    //     default: {},
    // },
    hoursPerOrg: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    semesterVolunteerHourGoal: {
        type: Number,
        default: 0
    },
    // [Removed this for now since we are not using it]
    // userStudentSemesters: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'studentSemester',
    // }],
    categoryTags: [String], // stores interest tags
    recoveryToken: {
        type: String,
        default: null
    },
    confirmToken: { // where the generated JWT token will be stored
        type: String,
        // required: true,
        default: ''
    },
    EmailToken: { // store the email token
        type: String,
        required: true
    },
    EmailValidated: { // if the user validated their email
        type: Boolean,
        // required: true,
        default: false
    }, 
    firstTimeLogin: {
        type: Boolean,
        required: true,
        default: true
    },
    receiveEmails: { // this is a new field to see if the student wants to receive emails
        type: String,
        required: "true",
        default: "true"
    },
    S3BucketImageDetails: {
        type: String, // would store the image name
        url: String,
        imageName: String,
		default: ""
    },
    notifications: [{
        message: String,
        type_is: String,
		eventId: String,
		orgId: String,
		orgName: String,
		// If it is an update, need to fill the 
		// update fields to open it
		updateContent: [{
			updateID: String,
			title: String,
			content: String,
			name: String,
			organizationID: String,
			date: {
				type: Date,
				default: Date.now
			}
		}],
        createdAt: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
	appearenceMode: {
		type: String,
		default: "light"
	},
    __v: {
        type: String,
        required: true,
        default: 0,
        select: false
    }
    
}, {collection: 'userStudent', timestamps: true, versionKey: false});



module.exports = mongoose.model('userStudent', userStudentSchema);
