// index.js optimizado 
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Variables de entorno
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } = process.env

const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`
const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body

    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid "fields" object in request body.' })
    }

    const response = await axios.post(
      airtableUrl,
      { fields },
      { headers }
    )

    res.status(200).json({
      message: 'Contacto creado correctamente en Airtable.',
      airtableId: response.data.id,
      createdTime: response.data.createdTime
    })
  } catch (error) {
    const status = error.response?.status || 500
    const message = error.response?.data || error.message
    console.error('Error al insertar en Airtable:', message)
    res.status(status).json({ error: m
