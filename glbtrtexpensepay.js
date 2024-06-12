// Copyright (c) 2024 Dwayne Hans Jr
//
// Distributed under the Boost Software License, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at
// http://www.boost.org/LICENSE_1_0.txt)

const express = require('express');

// Trip, Group, and Expense models
const Trip = require('./models/Trip');
const Group = require('./models/Group');
const Expense = require('./models/Expense');

const app = express();

app.use(express.json());

// Add an expense to a trip
app.post('/trip/:id/expense', async (req, res) => {
  const { description, amount, currency, paidBy } = req.body;
  const tripId = req.params.id;

  const newExpense = new Expense({
    description,
    amount,
    currency,
    paidBy,
    tripId
  });

  try {
    const expense = await newExpense.save();
    res.send('Expense added successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get the total expenses for a trip
app.get('/trip/:id/expenses', async (req, res) => {
  const tripId = req.params.id;

  try {
    const expenses = await Expense.find({ tripId });
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Refund a contribution
app.put('/trip/:tripId/expense/:expenseId/refund', async (req, res) => {
  const { amount } = req.body;
  const { tripId, expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense || expense.tripId !== tripId) {
      res.status(404).send('Expense not found');
    } else {
      expense.amount -= amount;
      await expense.save();
      res.send('Refund processed successfully');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => console.log('Server started on port 5000'));
