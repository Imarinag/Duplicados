// index.js optimizado 
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Airtable config desde variables de entorno
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env

const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`
const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

// Ruta POST /contactos
app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid "fields" object in request body.' })
    }

    const response = await axios.post(
      airtableUrl,
