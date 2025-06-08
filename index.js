// index.js optimizado 
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME; // Nuevo

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
  console.error('❌ Una o más variables de entorno están vacías. Verifica .env.');
  process.exit(1);
}

const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

app.post('/crearContacto', async (req, res) => {
  try {
    const data = req.body.fields;
    const response = await axios.post(
      airtableUrl,
      { fields: data },
      { headers }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error creando contacto:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Servidor activo en puerto ${port}`));
})



