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

// Crear un nuevo contacto
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid "fields" object in request body.' })
    }

    const response = await axios.post(airtableUrl, { fields }, { headers })
    res.status(200).json(response.data)
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
    res.status(200).json(response.d


