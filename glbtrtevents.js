// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const express = require('express');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Event and Group models
const Event = require('./models/Event');
const Group = require('./models/Group');

const app = express();

app.use(express.urlencoded({ extended: false }));

// Create a new event
app.post('/event', (req, res) => {
  const { eventName, location, date, groupIds } = req.body;

  const newEvent = new Event({
    eventName,
    location,
    date,
    groups: groupIds
  });

  newEvent.save()
    .then(event => {
      res.send('Event created successfully');
    })
    .catch(err => console.log(err));
});

// Invite a group to the event
app.post('/event/:id/invite', (req, res) => {
  const { groupId } = req.body;
  const eventId = req.params.id;

  Event.findById(eventId)
    .then(event => {
      if (!event) {
        res.status(404).send('Event not found');
      } else {
        event.groups.push(groupId);

        event.save()
          .then(() => {
            Group.findById(groupId)
              .then(group => {
                if (!group) {
                  res.status(404).send('Group not found');
                } else {
                  // Send an email invitation to each group member
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'your-email@gmail.com',
                      pass: 'your-password'
                    }
                  });

                  group.members.forEach(member => {
                    const mailOptions = {
                      from: 'your-email@gmail.com',
                      to: member,
                      subject: 'You have been invited to an event',
                      text: `Please click the following link to join the event: http://your-app.com/event/${eventId}`
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });
                  });

                  // Generate a QR code for the invitation
                  QRCode.toDataURL(`http://your-app.com/event/${eventId}`, (err, url) => {
                    console.log(url);
                  });

                  res.send('Invitation sent successfully');
                }
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

app.listen(5000, () => console.log('Server started on port 5000'));
