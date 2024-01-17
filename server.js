// npm modules
import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'

// database
import './config/database.js'

// routes
import { router as cryRouter } from './routes/cry.js'
import { router as authRouter } from './routes/auth.js'
import { router as profilesRouter } from './routes/profiles.js'

const app = express()
const portNum = 3001

app.use(cors())
app.use(express.json())

// mount routes
app.use('/api/cries', cryRouter)
app.use('/api/auth', authRouter)
app.use('/api/profiles', profilesRouter)

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
})