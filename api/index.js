import path from 'node:path'
import express from 'express'
import cookieParser from 'cookie-parser'
import { AuthRouter } from './routes/AuthRoutes.js'
import { AuthController } from './controllers/AuthController.js'
import { LinkRouter } from './routes/LInkRoutes.js'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT ?? 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(process.cwd(), './public/dist')))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "http://localhost:5173")
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(AuthController.authorize)

// API
app.use('/api/auth',AuthRouter)
app.use('/api/url', LinkRouter)

app.get('/api', (req, res) => {
    return res.json(path.join(process.cwd(), '../public/dist'))
})



// Routes Client
app.get('*', (req, res) => {
   res.sendFile(path.join(process.cwd(), './public/dist', 'index.html'))
})



app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`)
})