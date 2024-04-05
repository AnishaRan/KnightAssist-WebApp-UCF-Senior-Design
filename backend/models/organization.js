const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const UserStudent = require('./userStudent.js').schema;
// const Event = require('./events.js').schema;
// const OrganizationSemester = require('./organizationSemester.js').schema;

const organizationSchema = new Schema({
    /* This is not used anymore we will rely on the mongo natively provided IDs */
    // organizationID: {
    //     type: String, // keeping it as a string for now for ease of use
    //     required: true,
    //     unique: true
    // },
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    logoUrl: String,
    categoryTags: [String], // store tags for org
    // [Removed this for now as we do not use it]
    // followers: [{
    //     type: Schema.Types.ObjectId, // people that follow this organization
    //     ref: 'userStudent',
    // }],
    favorites: [{
        type: Schema.Types.ObjectId, // people that liked and favorited this organization
        ref: 'userStudent',
    }],
    updates: [{ // this work as announcements for the organization
        title: String,
        content: String,
        // sponsoringOrganization: String, [removed for now]
        date: {
            type: Date,
            default: Date.now
        }
    }],
    profilePicPath: {
        type: String,
        default: 'backend/images/defaultProfilePic.png'
    },
    calendarLink: String, // Could be a Google Calendar link or other platform
    contact: {
        email: String,
        phone: String,
        website: String,
        socialMedia: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String,
            // we can add more social media platforms here as needed
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    eventHappeningNow: {
        type: Boolean,
        default: false
    },
    backgroundURL: {
        type: String,
        default: 'backend/images/orgdefaultbackground.png'
    },
    eventsArray: [{
        type: String
    }],
    // added a component for the organization's location which can be either a string address, or  google maps link
    location: String,
    // [Removed this for now as we do not use it]
    // organizationSemesters: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'organizationSemester',
    // }],
    workingHoursPerWeek: {
        sunday: {
            start: String,
            end: String
        },
        monday: {
            start: String,
            end: String
        },
        tuesday: {
            start: String,
            end: String
        },
        wednesday: {
            start: String,
            end: String
        },
        thursday: {
            start: String,
            end: String
        },
        friday: {
            start: String,
            end: String
        },
        saturday: {
            start: String,
            end: String
        }
    },
    recoveryTokenForORG: {
        type: String,
        default: null
    },
    confirmTokenForORG: { // where the generated JWT token will be stored
        type: String,
        // required: true,
        default: ''
    },
    EmailTokenForORG: { // store the email token
        type: String,
        // required: true,
        default: ''
    },
    EmailValidated: { // if the organization validated their email
        type: Boolean,
        // required: true,
        default: false
    }, 
    role: {
        type: String,
        default: 'organization',
        required: true
    },
    firstTimeLogin: {
        type: Boolean,
        required: true,
        default: true
    },
	appearenceMode: {
		type: String,
		default: "light"
	},
    S3BucketImageDetails_ProfilePic: {
        type: String, // would store the image name
        url: String,
        imageName: String,
		default: ""
    },
    S3BucketImageDetails_Background: {
        type: String, // would store the image name
        url: String,
        imageName: String,
		default: ""
    },
    __v: {
        type: String,
        required: true,
        default: 0,
        select: true
    }
}, {collection: 'organization', timestamps: true, select: true, versionKey: false});

module.exports = mongoose.model('organization', organizationSchema);