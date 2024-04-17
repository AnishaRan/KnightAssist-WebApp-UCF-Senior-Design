/*
    allows finding a user by their ucf email credentials
    allows deleting a user by their ucf email credentials
*/

const express = require('express');
const router = express.Router();
const { authenticateToken_User } = require('../../utils/jwtUtils');

const userStudent = require('../../models/userStudent');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const mailgen = require('mailgen');

// lookUp user by email
router.get('/', async (req, res) => {
    const query = {
        $or: [
            { _id: req.body.id },
            { email: req.body.email }
        ]
    };
    await userStudent.findOne(query).then((user) => {
        if (user) { res.status(200).send(user); }
        else throw new Error()
    }).catch((err) => { res.status(400).send("User not found") });
});

// delete user by email
router.delete('/', async (req, res) => {
    const query = {
        $or: [
            { _id: req.body.id },
            { email: req.body.email }
        ]
    };
    let user_obj;
    await userStudent.findOne(query).then(async (user) => {
        if (user) {
            user_obj = user;

            const config = {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            }

            const transporterForLogin = nodemailer.createTransport(config);

            const mailGenerator = new mailgen({
                theme: 'default', // neopolitan, default, and cerberus are themes I liked
                product: {
                    name: 'KnightAssist',
                    link: 'https://knightassist-43ab3aeaada9.herokuapp.com/#/login', // dummy link will change later
                    // [not working yet]
                    // logo: '../utils/logo.svg', 
                    // logoWidth: '150px', 
                    // logoHeight: '50px', 
                },
            });

            let response = {
                body: {
                    name: user_obj.firstName + " " + user_obj.lastName,
                    intro: 'We are very sad to see you go!',
                    action: {
                        instructions: 'The account associated with ' + user_obj.email + ' has been deleted and all data will be removed within 5 days. If you did not request this, please contact us immediately by replying to this email.',
                        button: {
                            color: '#22BC66', //[makes the button green, can change later]
                            text: 'Login',
                            link: 'https://knightassist-43ab3aeaada9.herokuapp.com/#/login' // change this later with the correct redirect link
                        }
                    },
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
                }
            }

            let mail = mailGenerator.generate(response);

            let message = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'Account Deletion! [KnightAssist | email: ' + user_obj.email + ']',
                html: mail
            }
            
            if (user_obj.receiveEmails == "true")
                transporterForLogin.sendMail(message, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                    }
                });
            await userStudent.deleteOne({ email: user.email }).then((user) => {
                res.status(200).send("User deleted successfully" + user);
            }).catch((err) => { res.status(400).send("Internal server error: " + err); })
        }
        else throw new Error()
    }).catch((err) => {
        res.status(400).send("User not found");
    });
});

// export the router
module.exports = router;
