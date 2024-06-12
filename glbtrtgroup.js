// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const express = require('express');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Group model
const Group = require('./models/Group');

const app = express();

app.use(express.urlencoded({ extended: false }));

// Create a new group
app.post('/group', (req, res) => {
  const { groupName, members } = req.body;

  const newGroup = new Group({
    groupName,
    members
  });

  newGroup.save()
    .then(group => {
      res.send('Group created successfully');
    })
    .catch(err => console.log(err));
});

// Invite a new member to the group
app.post('/group/:id/invite', (req, res) => {
  const { email } = req.body;
  const groupId = req.params.id;

  Group.findById(groupId)
    .then(group => {
      if (!group) {
        res.status(404).send('Group not found');
      } else {
        group.members.push(email);

        group.save()
          .then(() => {
            // Send an email invitation
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'your-email@gmail.com',
                pass: 'your-password'
              }
            });

            const mailOptions = {
              from: 'your-email@gmail.com',
              to: email,
              subject: 'You have been invited to join a group',
              text: `Please click the following link to join the group: http://your-app.com/group/${groupId}`
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

            // Generate a QR code for the invitation
            QRCode.toDataURL(`http://your-app.com/group/${groupId}`, (err, url) => {
              console.log(url);
            });

            res.send('Invitation sent successfully');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

app.listen(5000, () => console.log('Server started on port 5000'));
