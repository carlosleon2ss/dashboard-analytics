import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL = 'ws://localhost:3001'
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

export function useWebSocket() {
  const [data, setData]           = useState(null)
  const [status, setStatus]       = useState('connecting') // connecting | open | closed | error
  const wsRef                     = useRef(null)
  const reconnectAttempts         = useRef(0)
  const reconnectTimeout          = useRef(null)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(' WebSocket conectado')
        setStatus('open')
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)
          setData(parsed)
        } catch (e) {
          console.error('Error parseando mensaje:', e)
        }
      }

      ws.onclose = () => {
        setStatus('closed')
        // Reconexión automática
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1
          console.log(` Reconectando... intento ${reconnectAttempts.current}`)
          reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY)
        }
      }

      ws.onerror = () => {
        setStatus('error')
        ws.close()
      }

    } catch (e) {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimeout.current)
      wsRef.current?.close()
    }
  }, [connect])

  return { data, status }
}