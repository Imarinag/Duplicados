// index.js completo funcional
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer'); // Para importar desde imagen/Excel
const app = express();
const upload = multer();

app.use(express.json());

// ✅ Middleware de autenticación por API Key
app.use((req, res, next) => {
  const apiKey = req.header("Authorization");
  const expectedApiKey = `Bearer ${process.env.INTERNAL_API_KEY}`;
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// 🌍 Variables de entorno
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// ✅ Listar contactos
app.get('/contactos', async (req, res) => {
  try {
    const { data } = await axios.get(AIRTABLE_URL, { headers });
    res.json(data.records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Crear contacto
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body;
    const { data } = await axios.post(AIRTABLE_URL, { fields }, { headers });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Actualizar contacto
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

// ❌ Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${AIRTABLE_URL}/${id}`, { headers });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🎯 Duplicados (simulado)
app.post('/Contactos/duplicados', async (req, res) => {
  try {
    res.json({ status: 'Revisado: lógica pendiente de implementar' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 Buscar datos externos (simulado)
app.post('/Datos/buscar', async (req, res) => {
  const { nombre } = req.body;
  res.json({
    nombre,
    datos: {
      Email: `${nombre.toLowerCase().replace(/\s/g, '')}@example.com`,
      Ciudad: "Ciudad de México",
      SitioWeb: "https://www.ejemplo.com"
    }
  });
});

// 📤 Importar desde Excel (simulado)
app.post('/Importar/excel', upload.single('archivo'), (req, res) => {
  res.json({ status: "Excel recibido y procesado (simulado)" });
});

// 📤 Importar desde Imagen (simulado)
app.post('/Importar/imagen', upload.single('imagen'), (req, res) => {
  res.json({ status: "Imagen recibida y OCR ejecutado (simulado)" });
});

// 📧 Enviar campaña (simulado)
app.post('/Campanas/enviar', (req, res) => {
  const { filtro, plantilla } = req.body;
  res.json({ status: `Campaña enviada con filtro ${filtro}` });
});

// 🚀 Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


