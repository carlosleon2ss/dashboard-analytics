require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { initWebSocket } = require('./websocket')
const apiRoutes = require('./routes/api')
const { runMigrations } = require('./migrations')
const authRoutes = require('./routes/auth')
const { authMiddleware } = require('./middleware/auth')

const app  = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

app.use('/api/metrics', authMiddleware, apiRoutes)

// Rutas REST
app.use('/api', apiRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Servidor HTTP + WebSocket
const server = http.createServer(app)
initWebSocket(server)

// Inicia el servidor después de crear tablas
runMigrations().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
})