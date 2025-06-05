// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

app.get('/contactos', async (req, res) => {
  try {
    const { data } = await axios.get(AIRTABLE_URL, { headers });
    res.json(data.records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body;
    const { data } = await axios.post(AIRTABLE_URL, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;
    const { data } = await axios.patch(`${AIRTABLE_URL}/${id}`, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${AIRTABLE_URL}/${id}`, { headers });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
