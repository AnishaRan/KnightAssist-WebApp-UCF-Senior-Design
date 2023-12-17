const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const Event = require('../../models/events');
const Organization = require('../../models/organization');
const UserStudent = require('../../models/userStudent');

// Encryption key and algorithm
const algorithm = 'aes-256-ctr';
const secretKey = process.env.secretKey_images;
const iv = Buffer.from(process.env.iv_images, 'hex'); // Convert hex string to bytes

router.get('/', async (req, res) => {
        try {
                const id = req.params.id;
                const entityType = req.params.entityType;

                let user;
                switch (entityType) {
                        case 'event':
                                user = await Event.findById(id);
                                break;
                        case 'organization':
                                user = await Organization.findById(id);
                                break;
                        case 'student':
                                user = await UserStudent.findById(id);
                                break;
                        default:
                                throw new Error('Invalid entity type');
                }
                
                if (!user || !user.profilePicPath) {
                        return res.status(404).send('Image not found or entity does not exist');
                }

                const filePath = user.profilePicPath; 

                // Decrypt the file
                const decryptedImage = decryptFile(filePath);

                // update the response header with the content type
                if (path.extname(filePath) === '.png') {
                        res.setHeader('Content-Type', 'image/png');
                } else if (path.extname(filePath) === '.jpg') {
                        res.setHeader('Content-Type', 'image/jpeg');
                } else {
                        throw new Error('Invalid file type');
                }

                // Send the response with the decrypted image
                res.send(decryptedImage);

        } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred');
        }
});

function decryptFile(filePath) {
        const encryptedImage = fs.readFileSync(filePath);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        const decrypted = Buffer.concat([decipher.update(encryptedImage), decipher.final()]);
        return decrypted;
}

module.exports = router;
