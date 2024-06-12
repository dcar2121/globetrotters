// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const axios = require('axios');

// Function to get flight data
async function getFlightData(departure, arrival, date) {
  try {
    const response = await axios.get('https://api.airline.com/flights', {
      params: {
        departure: departure,
        arrival: arrival,
        date: date
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Use the function
getFlightData('NYC', 'LON', '2022-12-01')
  .then(data => console.log(data))
  .catch(error => console.error(error));
