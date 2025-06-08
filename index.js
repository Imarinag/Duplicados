// index.js optimizado 
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env
const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`
const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

// Crear nuevo contacto
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid "fields" object in request body.' })
    }

    const response = await axios.post(airtableUrl, { fields }, { headers })
    res.status(201).json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message })
  }
})

// Obtener todos los contactos
app.get('/contactos', async (req, res) => {
  try {
    const response = await axios.get(airtableUrl, { headers })
    res.status(200).json(response.data.records)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos desde Airtable' })
  }
})

// Obtener un contacto por ID
app.get('/contactos/:id', async (req, res) => {
  try {
    const response = await axios.get(`${airtableUrl}/${req.params.id}`, { headers })
    res.status(200).json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message })
  }
})

// Reemplazar un contacto completamente (PUT)
app.put('/contactos/:id', async (req, res) => {
  try {
    const { fields } = req.body
    const response = await axios.put(`${airtableUrl}/${req.params.id}`, { fields }, { headers })
    res.status(200).json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message })
  }
})

// Actualizar parcialmente un contacto (PATCH)
app.patch('/contactos/:id', async (req, res) => {
  try {
    const { fields } = req.body
    const response = await axios.patch(`${airtableUrl}/${req.params.id}`, { fields }, { headers })
    res.status(200).json(response.data)
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message })
  }
})

// Eliminar un contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
    await axios.delete(`${airtableUrl}/${req.params.id}`, { headers })
    res.status(200).json({ deleted: true, id: req.params.id })
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message })
  }
})

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API completa de gestión de contactos Airtable está activa.')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})



