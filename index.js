// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Middleware de autenticación
app.use((req, res, next) => {
  const apiKey = req.header("Authorization");
  const expectedApiKey = process.env.API_KEY;

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

// Listar contactos
app.get('/Contactos', async (req, res) => {
  try {
    const { data } = await axios.get(AIRTABLE_URL, { headers });
    res.json(data.records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear contacto
app.post('/Contactos', async (req, res) => {
  try {
    const { fields } = req.body;
    const { data } = await axios.post(AIRTABLE_URL, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar contacto
app.patch('/Contacts/:id', async (req, res) => {
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
app.delete('/Contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${AIRTABLE_URL}/${id}`, { headers });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Detectar y eliminar duplicados (ruta necesaria para el GPT)
app.post('/Contactos/duplicados', async (req, res) => {
  const verificar = req.body.verificar;
  if (!verificar) {
    return res.status(400).json({ error: 'Falta el campo verificar' });
  }
  try {
    // Aquí se implementaría la lógica real de detección de duplicados
    res.status(200).json({ mensaje: 'Duplicados gestionados exitosamente (demo)' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar duplicados' });
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
