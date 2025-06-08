// index.js optimizado 
import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const airtableEndpoint = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}`
const airtableHeaders = {
  Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
}

app.post('/crearContacto', async (req, res) => {
  try {
    const { fields } = req.body
    const response = await axios.post(
      airtableEndpoint,
      { fields },
      { headers: airtableHeaders }
    )
    res.status(200).json(response.data)
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: error.response?.data || error.message })
  }
})

app.get('/', (req, res) => {
  res.send('API para crear contactos en Airtable está activa.')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
