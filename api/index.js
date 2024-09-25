import path from 'node:path'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

const PORT = process.env.PORT ?? 5000

app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(process.cwd(), './app/dist')))

// API

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