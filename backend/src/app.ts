import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/taskRoutes'

const app = express()
// const PORT = 4200

app.use(cors())
app.use(express.json())

app.use('/tasks', taskRoutes)
module.exports = app;