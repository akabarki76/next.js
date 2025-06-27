// packages/next/src/client/components/ReactDevOverlay/error-logger.ts
import { onErrorEvent } from 'next/dist/client/components/ReactDevOverlay/error-overlay'
import { serializeLogEvent } from './serialize-log-event'

export function registerErrorLogger(socket: WebSocket) {
  if (!process.env.__NEXT_EXPERIMENTAL_FORWARD_LOGS) return

  // Error event forwarding
  onErrorEvent((err, info) => {
    socket.send(JSON.stringify({
      type: 'forwarded-error',
      payload: serializeLogEvent({ err, info })
    }))
  })

  // Console method wrapping
  const consoleMethods = ['log', 'warn', 'error', 'debug', 'info'] as const
  for (const method of consoleMethods) {
    const original = console[method]
    console[method] = (...args: any[]) => {
      original.apply(console, args)
      socket.send(JSON.stringify({
        type: 'forwarded-log',
        payload: serializeLogEvent({ 
          level: method, 
          args,
          timestamp: Date.now()
        })
      }))
    }
  }
}
