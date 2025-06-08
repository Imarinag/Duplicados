// index.js optimizado 
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const airtableBaseId = process.env.AIRTABLE_BASE_ID
const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableTable = process.env.AIRTABLE_TABLE_NAME

const airtableEndpoint = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTable)}`
const airtableHeaders = {
  Authorization: `Bearer ${airtableApiKey}`,
  'Content-Type': 'application/json',
}

app.post('/contactos', async (req, res) => {
  try {
    const { fields } = req.body

    const response = await axios.post(
      airtableEndpoint,
      { fields },
      { headers: airtableHeaders }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Airtable error:', error.response?.data || error.message)
    res.status(500).json({ error: error.response?.data || error.message })
  }
})

app.get('/', (req, res) => {
  res.send('API de contactos operativa en Render.')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`)
})
