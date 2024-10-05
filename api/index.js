import path from 'node:path'
import express from 'express'
import cookieParser from 'cookie-parser'
import { AuthRouter } from './routes/AuthRoutes.js'
import { AuthController } from './controllers/AuthController.js'
import { LinkRouter } from './routes/LInkRoutes.js'

const app = express()

const PORT = process.env.PORT ?? 5000

app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(process.cwd(), './app/dist')))

// app.use(AuthController.authorize)

// API
app.use('/api/auth',AuthRouter)
app.use('/api/url', LinkRouter)

app.get('/api', (req, res) => {
    return res.json(path.join(process.cwd(), '../app/dist'))
})



// Routes Client
app.get('*', (req, res) => {
   res.sendFile(path.join(process.cwd(), './app/dist', 'index.html'))
})



app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`)
})