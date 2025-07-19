import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/taskRoutes'

const app = express()
const PORT = process.env.PORT || 4200

app.use(express.json())
app.use(cors())

app.use('/tasks', taskRoutes)
module.exports = app;