// index.js optimizado 
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Airtable config
const AIRTABLE_API_KEY = 'patrF3QPNf9lrm8lc.796b9af6623c664d06bedc18faf1c446dafa6bbdfdeb49dbfc33988b9db0327f';
const BASE_ID = 'app5UnTdKfNX1VAhm';
const TABLE_ID = 'tbltuIqmCt11Jl8T8'; // ID real de la tabla
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

// Endpoint para crear contacto
app.post('/api/crearContacto', async (req, res) => {
  const { fields } = req.body;

  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'El cuerpo debe incluir un objeto "fields" válido.' });
  }

  try {
    const response = await axios.post(
      AIRTABLE_URL,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Contacto creado:', response.data);
    res.status(200).json({ message: 'Contacto creado exitosamente.', data: response.data });
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error('❌ Error al crear contacto:', errMsg);
    res.status(500).json({ error: errMsg });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
});




