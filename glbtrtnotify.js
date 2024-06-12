// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

// send mail with defined transport object
let sendNotification = (email, subject, text) => {
  let mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

// Call the sendNotification function when an important action is taken
// For example, when a new expense is added:
app.post('/trip/:id/expense', async (req, res) => {
  // ... code to add the expense ...

  // After the expense is added, send a notification
  let email = 'group-member-email@example.com';
  let subject = 'New expense added';
  let text = 'A new expense has been added to the trip. Please check the app for details.';
  sendNotification(email, subject, text);

  const express = require('express');
const multer = require('multer');

// Trip, Itinerary, Message, and Image models
const Trip = require('./models/Trip');
const Itinerary = require('./models/Itinerary');
const Message = require('./models/Message');
const Image = require('./models/Image');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Add an itinerary item to a trip
app.post('/trip/:id/itinerary', async (req, res) => {
  const { activity, location, date, time } = req.body;
  const tripId = req.params.id;

  const newItineraryItem = new Itinerary({
    activity,
    location,
    date,
    time,
    tripId
  });

  try {
    const itineraryItem = await newItineraryItem.save();
    res.send('Itinerary item added successfully');
  } catch (err) {
    res.status(500).send('An error occurred');
  }
});

// Post a message to a trip
app.post('/trip/:id/message', async (req, res) => {
  const { content, author } = req.body;
  const tripId = req.params.id;

  const newMessage = new Message({
    content,
    author,
    tripId
  });

  try {
    const message = await newMessage.save();
    res.send('Message posted successfully');
  } catch (err) {
    res.status(500).send('An error occurred');
  }
});

// Post an image to a trip
app.post('/trip/:id/image', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const tripId = req.params.id;
  const imageUrl = req.file.path;

  const newImage = new Image({
    title,
    description,
    imageUrl,
    tripId
  });

  try {
    const image = await newImage.save();
    res.send('Image posted successfully');
  } catch (err) {
    res.status(500).send('An error occurred');
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));


// Similarly, you can send notifications when the itinerary is updated, flight or train information changes, or emergency alerts are issued.
