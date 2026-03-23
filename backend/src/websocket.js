const WebSocket = require('ws')
const { generateMetrics } = require('./metricsSimulator')

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server })

  console.log('WebSocket server iniciado')

  wss.on('connection', (ws) => {
    console.log(' Cliente conectado')

    // Envía métricas cada 2 segundos
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const metrics = generateMetrics()
        ws.send(JSON.stringify(metrics))
      }
    }, 2000)

    // Heartbeat — detecta clientes desconectados
    ws.isAlive = true
    ws.on('pong', () => { ws.isAlive = true })

    ws.on('close', () => {
      console.log('Cliente desconectado')
      clearInterval(interval)
    })

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message)
      clearInterval(interval)
    })

    // Envía un snapshot inmediato al conectarse
    ws.send(JSON.stringify(generateMetrics()))
  })

  // Ping cada 30s para limpiar conexiones muertas
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate()
      ws.isAlive = false
      ws.ping()
    })
  }, 30000)

  wss.on('close', () => clearInterval(heartbeat))

  return wss
}

module.exports = { initWebSocket }