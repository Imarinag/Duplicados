// index.js optimizado (sin imagen para evitar errores de respuesta larga)
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Middleware de autorización
app.use((req, res, next) => {
  const apiKey = req.header("Authorization");
  const expectedApiKey = `Bearer ${process.env.INTERNAL_API_KEY}`;

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

// Variables de entorno
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Listar contactos (sin campo Foto del proyecto)
app.get('/contactos', async (req, res) => {
  try {
    const { data } = await axios.get(AIRTABLE_URL, { headers });
    const sanitized = data.records.map(record => {
      const { fields, id } = record;
      delete fields['Foto del proyecto'];
      return { id, fields };
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear contacto (sin campo Foto del proyecto)
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body;
    delete fields['Foto del proyecto'];
    const { data } = await axios.post(AIRTABLE_URL, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar contacto
app.patch('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;
    const { data } = await axios.patch(`${AIRTABLE_URL}/${id}`, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${AIRTABLE_URL}/${id}`, { headers });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detectar duplicados (simple stub)
app.post('/Contactos/duplicados', async (req, res) => {
  try {
    res.json({ status: 'Revisado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));



