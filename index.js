// index.js optimizado 
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.BASE_ID;
const TABLE_ID = process.env.TABLE_ID;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

// Crear contacto
app.post('/contactos', async (req, res) => {
  const { fields } = req.body;
  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'El cuerpo debe incluir un objeto "fields" válido.' });
  }
  try {
    const response = await axios.post(AIRTABLE_URL, { fields }, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json({ message: 'Contacto creado exitosamente.', data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Listar contactos
app.get('/contactos', async (req, res) => {
  try {
    const response = await axios.get(AIRTABLE_URL, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Actualizar contacto
app.patch('/contactos/:recordId', async (req, res) => {
  const { recordId } = req.params;
  const { fields } = req.body;
  try {
    const response = await axios.patch(`${AIRTABLE_URL}/${recordId}`, { fields }, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Eliminar contacto
app.delete('/contactos/:recordId', async (req, res) => {
  const { recordId } = req.params;
  try {
    const response = await axios.delete(`${AIRTABLE_URL}/${recordId}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    res.status(200).json({ message: 'Contacto eliminado.', data: response.data });
  } catch (error) {
    res.status(500).json({ error: er
