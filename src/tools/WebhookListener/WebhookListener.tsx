import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createServer, IncomingMessage, ServerResponse, Server } from 'http'
import { parse as parseUrl } from 'url'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { CopyButton } from '../../components/shared/CopyButton'
import { v4 as uuidv4 } from 'uuid'

interface WebhookRequest {
  id: string
  timestamp: number
  method: string
  path: string
  headers: Record<string, string>
  query: Record<string, string>
  body: string
  bodyParsed: any | null
}

const MAX_REQUESTS = 100
const FIXED_PORT = 9000

type ToolComponent = React.FC & { infoContent?: React.ReactNode }

export const WebhookListener: ToolComponent = () => {
  const port = FIXED_PORT
  const [isListening, setIsListening] = useState(false)
  const [requests, setRequests] = useState<WebhookRequest[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const serverRef = useRef<Server | null>(null)

  const handleRequest = useCallback((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parseUrl(req.url || '/', true)
    const headers: Record<string, string> = {}

    for (const [key, value] of Object.entries(req.headers)) {
      headers[key] = Array.isArray(value) ? value.join(', ') : value || ''
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      let bodyParsed = null
      try {
        if (body) bodyParsed = JSON.parse(body)
      } catch { }

      const newRequest: WebhookRequest = {
        id: uuidv4(),
        timestamp: Date.now(),
        method: req.method || 'GET',
        path: parsedUrl.pathname || '/',
        headers,
        query: (parsedUrl.query as Record<string, string>) || {},
        body,
        bodyParsed,
      }

      setRequests((prev) => [newRequest, ...prev].slice(0, MAX_REQUESTS))

      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Content-Type', 'application/json')

      if (req.method === 'OPTIONS') {
        res.statusCode = 204
        res.end()
      } else {
        res.statusCode = 200
        res.end(JSON.stringify({ received: true, timestamp: newRequest.timestamp, id: newRequest.id }))
      }
    })
  }, [])

  const startServer = useCallback(() => {
    if (serverRef.current) return
    try {
      const server = createServer(handleRequest)
      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') setError(`Port ${port} is already in use`)
        else setError(err.message)
        setIsListening(false)
        serverRef.current = null
      })
      server.listen(port, 'localhost', () => {
        setIsListening(true)
        setError(null)
      })
      serverRef.current = server
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start server')
    }
  }, [port, handleRequest])

  const stopServer = useCallback(() => {
    if (serverRef.current) {
      serverRef.current.close()
      serverRef.current = null
      setIsListening(false)
    }
  }, [])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearRequests = () => {
    setRequests([])
    setExpandedIds(new Set())
  }

  useEffect(() => {
    return () => {
      if (serverRef.current) serverRef.current.close()
    }
  }, [])

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: theme.colors.success,
      POST: theme.colors.info,
      PUT: theme.colors.warning,
      PATCH: theme.colors.secondary,
      DELETE: theme.colors.error,
      OPTIONS: theme.colors.text.tertiary,
    }
    return colors[method] || theme.colors.text.secondary
  }

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  const getRequestAsCurl = (req: WebhookRequest) => {
    let curl = `curl -X ${req.method} "http://localhost:${port}${req.path}"`
    for (const [key, value] of Object.entries(req.headers)) {
      if (!['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
        curl += ` \\\n  -H "${key}: ${value}"`
      }
    }
    if (req.body) {
      curl += ` \\\n  -d '${req.body}'`
    }
    return curl
  }

  const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }
  const controlsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexWrap: 'wrap' }
  const statusContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: isListening ? theme.colors.successAlpha : theme.colors.errorAlpha,
    border: `1px solid ${isListening ? theme.colors.success : theme.colors.error}`,
  }
  const statusTextStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: theme.typography.fontSize.base, fontFamily: theme.typography.fontFamily.primary, color: theme.colors.text.primary }
  const statusDotStyle: React.CSSProperties = { width: '10px', height: '10px', borderRadius: theme.borderRadius.full, background: isListening ? theme.colors.success : theme.colors.error, animation: isListening ? 'pulse 2s infinite' : 'none' }
  const endpointStyle: React.CSSProperties = { fontFamily: theme.typography.fontFamily.mono, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, background: theme.colors.background.tertiary, padding: `${theme.spacing.xs} ${theme.spacing.sm}`, borderRadius: theme.borderRadius.sm }
  const requestsListStyle: React.CSSProperties = { maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }
  const requestCardStyle: React.CSSProperties = { background: theme.colors.background.card, borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border.default}`, overflow: 'hidden', transition: theme.transitions.fast }
  const requestHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.md, cursor: 'pointer', transition: theme.transitions.fast }
  const requestInfoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: theme.spacing.md }
  const methodBadgeStyle = (method: string): React.CSSProperties => ({ padding: `${theme.spacing.xs} ${theme.spacing.sm}`, borderRadius: theme.borderRadius.sm, background: `${getMethodColor(method)}22`, color: getMethodColor(method), fontSize: theme.typography.fontSize.xs, fontWeight: theme.typography.fontWeight.bold, fontFamily: theme.typography.fontFamily.mono, minWidth: '60px', textAlign: 'center' })
  const pathStyle: React.CSSProperties = { fontFamily: theme.typography.fontFamily.mono, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.primary }
  const timestampStyle: React.CSSProperties = { fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, fontFamily: theme.typography.fontFamily.mono }
  const expandIconStyle: React.CSSProperties = { fontSize: theme.typography.fontSize.sm, color: theme.colors.text.tertiary, transition: theme.transitions.fast }
  const requestDetailsStyle: React.CSSProperties = { padding: theme.spacing.md, paddingTop: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.md }
  const detailSectionStyle: React.CSSProperties = { background: theme.colors.background.tertiary, borderRadius: theme.borderRadius.sm, padding: theme.spacing.md }
  const detailTitleStyle: React.CSSProperties = { fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: theme.spacing.sm, fontFamily: theme.typography.fontFamily.primary }
  const detailContentStyle: React.CSSProperties = { fontFamily: theme.typography.fontFamily.mono, fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
  const emptyStateStyle: React.CSSProperties = { textAlign: 'center', padding: theme.spacing['2xl'], color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.base, fontFamily: theme.typography.fontFamily.primary }
  const errorStyle: React.CSSProperties = { padding: theme.spacing.md, borderRadius: theme.borderRadius.md, background: theme.colors.errorAlpha, border: `1px solid ${theme.colors.error}`, color: theme.colors.error, fontSize: theme.typography.fontSize.sm, fontFamily: theme.typography.fontFamily.primary }
  const copyActionsStyle: React.CSSProperties = { display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.sm }

  return (
    <div style={containerStyle}>
      <ToolCard>
        <div style={controlsStyle}>
          {isListening ? (
            <Button variant="danger" onClick={stopServer}>Stop</Button>
          ) : (
            <Button variant="success" onClick={startServer}>Start</Button>
          )}
          <Button variant="ghost" onClick={clearRequests} disabled={requests.length === 0}>
            Clear ({requests.length})
          </Button>
        </div>
        {error && <div style={errorStyle}>{error}</div>}
        <div style={{ ...statusContainerStyle, marginTop: theme.spacing.md }}>
          <div style={statusTextStyle}>
            <div style={statusDotStyle} />
            <span>{isListening ? 'Listening' : 'Stopped'}</span>
          </div>
          {isListening && <code style={endpointStyle}>http://localhost:{port}</code>}
        </div>
      </ToolCard>

      <ToolCard title={`Requests (${requests.length})`}>
        {requests.length === 0 ? (
          <div style={emptyStateStyle}>{isListening ? 'Waiting for requests...' : 'Start the server to capture requests'}</div>
        ) : (
          <div style={requestsListStyle}>
            {requests.map((req) => {
              const isExpanded = expandedIds.has(req.id)
              return (
                <div key={req.id} style={requestCardStyle}>
                  <div
                    style={requestHeaderStyle}
                    onClick={() => toggleExpanded(req.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = theme.colors.background.hover }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={requestInfoStyle}>
                      <span style={methodBadgeStyle(req.method)}>{req.method}</span>
                      <span style={pathStyle}>{req.path}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                      <span style={timestampStyle}>{formatTimestamp(req.timestamp)}</span>
                      <span style={{ ...expandIconStyle, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={requestDetailsStyle}>
                      <div style={detailSectionStyle}>
                        <div style={detailTitleStyle}>Headers</div>
                        <div style={detailContentStyle}>{formatJson(req.headers)}</div>
                      </div>
                      {Object.keys(req.query).length > 0 && (
                        <div style={detailSectionStyle}>
                          <div style={detailTitleStyle}>Query Parameters</div>
                          <div style={detailContentStyle}>{formatJson(req.query)}</div>
                        </div>
                      )}
                      {req.body && (
                        <div style={detailSectionStyle}>
                          <div style={detailTitleStyle}>Body</div>
                          <div style={detailContentStyle}>{req.bodyParsed ? formatJson(req.bodyParsed) : req.body}</div>
                        </div>
                      )}
                      <div style={copyActionsStyle}>
                        <CopyButton text={formatJson(req)} size="sm" variant="ghost" />
                        <CopyButton text={getRequestAsCurl(req)} size="sm" variant="ghost" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </ToolCard>
    </div>
  )
}

WebhookListener.infoContent = (
  <div>
    <strong>About Webhook Listener:</strong> This tool creates a local HTTP server that captures and displays incoming webhook requests. Perfect for testing webhooks during development.
    <ul style={{ marginTop: theme.spacing.sm }}>
      <li>All HTTP methods are supported (GET, POST, PUT, DELETE, PATCH)</li>
      <li>CORS headers are automatically included in responses</li>
      <li>Requests are stored locally (max {MAX_REQUESTS})</li>
      <li>Click on a request to expand and see full details</li>
    </ul>
    <div style={{ marginTop: theme.spacing.md }}>
      <strong>Example:</strong>
      <code style={{ display: 'block', marginTop: theme.spacing.sm, padding: theme.spacing.sm, background: theme.colors.background.tertiary, borderRadius: theme.borderRadius.sm, fontSize: theme.typography.fontSize.xs }}>
        {`curl -X POST http://localhost:${FIXED_PORT}/webhook -H "Content-Type: application/json" -d '{"test": true}'`}
      </code>
    </div>
  </div>
)
