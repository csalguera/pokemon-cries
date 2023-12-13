// npm modules
import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'

// database
import './config/database.js'

// routes
import { router as cryRouter } from './routes/cry.js'

const app = express()
const portNum = 3001

app.use(cors())
app.use(express.json())

// mount routes
app.use('/api/cries', cryRouter)

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
})