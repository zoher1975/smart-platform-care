const express = require('express');

const app = express();

app.use(express.json());

// اختبار السيرفر
app.get('/', (req, res) => {
  res.send('Smart Platform API is running 🚀');
});

module.exports = app;
