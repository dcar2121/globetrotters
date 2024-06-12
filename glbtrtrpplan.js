// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const express = require('express');

// Trip and Itinerary models
const Trip = require('./models/Trip');
const Itinerary = require('./models/Itinerary');

const app = express();

app.use(express.json());

// Create a new trip
app.post('/group/:id/trip', async (req, res) => {
  const { destination, duration, dates } = req.body;
  const groupId = req.params.id;

  const newTrip = new Trip({
    destination,
    duration,
    dates,
    groupId
  });

  try {
    const trip = await newTrip.save();
    res.send('Trip created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while creating the trip');
  }
});
app.post('/trip', async (req, res) => {
  const { destination, duration, startDate, endDate, groupId, airline, carRental, hotel, festivalTickets, trainTickets } = req.body;

  const newTrip = new Trip({
    destination,
    duration,
    startDate,
    endDate,
    groupId,
    airline,
    carRental,
    hotel,
    festivalTickets,
    trainTickets
  });

  try {
    const trip = await newTrip.save();
    res.send('Trip created successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a trip
app.put('/trip/:id', async (req, res) => {
  const { destination, duration, startDate, endDate, groupId, airline, carRental, hotel, festivalTickets, trainTickets } = req.body;
  const tripId = req.params.id;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).send('Trip not found');
    } else {
      trip.destination = destination;
      trip.duration = duration;
      trip.startDate = startDate;
      trip.endDate = endDate;
      trip.groupId = groupId;
      trip.airline = airline;
      trip.carRental = carRental;
      trip.hotel = hotel;
      trip.festivalTickets = festivalTickets;
      trip.trainTickets = trainTickets;

      await trip.save();
      res.send('Trip updated successfully');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

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
    res.status(500).send(err);
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));
