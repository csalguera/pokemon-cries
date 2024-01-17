// npm modules
import 'dotenv/config.js'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import formData from 'express-form-data'

// database
import './config/database.js'

// routes
import { router as criesRouter } from './routes/cries.js'
import { router as authRouter } from './routes/auth.js'
import { router as profilesRouter } from './routes/profiles.js'

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(formData.parse())

// mount routes
app.use('/api/cries', criesRouter)
app.use('/api/auth', authRouter)
app.use('/api/profiles', profilesRouter)

export { app }