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
const BASE_ID = process.env.AIRTABLE_BASE_ID || process.env.BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// GET /contactos
app.get('/contactos', async (req, res) => {
  try {
    const response = await axios.get(AIRTABLE_URL, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    res.json(response.data.records);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// POST /contactos
app.post('/contactos', async (req, res) => {
  const { fields } = req.body;
  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'El cuerpo debe incluir fields como objeto.' });
  }
  try {
    const response = await axios.post(AIRTABLE_URL, { fields }, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// PATCH /contactos/:recordId
app.patch('/contactos/:recordId', async (req, res) => {
  const { recordId } = req.params;
  const { fields } = req.body;
  try {
    const response = await axios.patch(`${AIRTABLE_URL}/${recordId}`, { fields }, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// DELETE /contactos/:recordId
app.delete('/contactos/:recordId', async (req, res) => {
  const { recordId } = req.params;
  try {
    await axios.delete(`${AIRTABLE_URL}/${recordId}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });
    res.json({ deleted: recordId });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// POST /contactos/duplicados
app.post('/contactos/duplicados', (req, res) => {
  const { verificar } = req.body;
  if (typeof verificar !== 'boolean') {
    return res.status(400).json({ error: 'verificar es booleano.' });
  }
  res.json({ status: 'OK', verificar });
});

// Otros endpoints vacíos
app.post('/Campanas/enviar', (req, res) => res.json({ status: 'Campaña recibida' }));
app.post('/Importar/excel', (req, res) => res.json({ status: 'Excel recibido' }));
app.post('/Importar/imagen', (req, res) => res.json({ status: 'Imagen recibida' }));
app.post('/Datos/buscar', (req, res) => res.json({ status: 'Búsqueda recibida' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
