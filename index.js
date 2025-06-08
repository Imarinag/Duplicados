// index.js optimizado 
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 🔐 Autenticación
app.use((req, res, next) => {
  const apiKey = req.header("Authorization");
  const expectedApiKey = `Bearer ${process.env.INTERNAL_API_KEY}`;

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// 🌍 Datos del entorno
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME; // e.g. Contactos
const API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Listar contactos
app.get('/contactos', async (req, res) => {
  try {
    const { filterByFormula } = req.query;
    const url = filterByFormula
      ? `${AIRTABLE_URL}?filterByFormula=${encodeURIComponent(filterByFormula)}`
      : AIRTABLE_URL;
    const response = await axios.get(url, { headers });
    res.json(response.data.records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear contacto
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body;
    const response = await axios.post(AIRTABLE_URL, { fields }, { headers });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Actualizar contacto
app.patch('/contactos/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    const { fields } = req.body;
    const url = `${AIRTABLE_URL}/${recordId}`;
    const response = await axios.patch(url, { fields }, { headers });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Eliminar contacto
app.delete('/contactos/:recordId', async (req, res) => {
  try {
    const { recordId } = req.params;
    const url = `${AIRTABLE_URL}/${recordId}`;
    await axios.delete(url, { headers });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Detectar duplicados
app.post('/contactos/duplicados', async (req, res) => {
  // Aquí va tu lógica de duplicados
  res.json({ status: 'Revisado' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));


