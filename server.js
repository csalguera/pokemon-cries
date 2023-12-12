// npm modules
import 'dotenv/config.js'
import express from 'express'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// database
import './config/database.js'

// routes
import { router as cryRouter } from './routes/cry.js'

const app = express()
const portNum = 3001
const uploadsDirectory = path.join(dirname(fileURLToPath(import.meta.url)), 'uploads');

app.use(express.json())

// mount routes
app.use('/api/cries', cryRouter)
app.use('/api/cry', express.static(uploadsDirectory));


app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
})