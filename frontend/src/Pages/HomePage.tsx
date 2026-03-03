import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCcw } from 'lucide-react'

type ApiStatus = 'idle' | 'loading' | 'success' | 'error'

function StatusBadge({ status, message }: { status: ApiStatus; message: string | null }) {
  if (status === 'idle') return <Badge variant="muted">—</Badge>
  if (status === 'loading') return <Badge variant="warning">Connecting…</Badge>
  if (status === 'success') return <Badge variant="success">✓ {message}</Badge>
  return <Badge variant="error">✗ {message}</Badge>
}

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('idle')
  const [apiMessage, setApiMessage] = useState<string | null>(null)

  const [dbStatus, setDbStatus] = useState<ApiStatus>('idle')
  const [dbMessage, setDbMessage] = useState<string | null>(null)

  const fetchHello = useCallback(async () => {
    setApiStatus('loading')
    try {
      const { data } = await axios.get<{ message: string }>('/api/hello')
      setApiMessage(data.message)
      setApiStatus('success')
    } catch {
      setApiMessage('Failed to reach API')
      setApiStatus('error')
    }
  }, [])

  const fetchDbCheck = useCallback(async () => {
    setDbStatus('loading')
    try {
      const { data } = await axios.get<{ connected: boolean; result?: number; error?: string }>('/api/db-check')
      if (data.connected) {
        setDbMessage(`Connected : ${data.result}`)
        setDbStatus('success')
      } else {
        setDbMessage(data.error ?? 'DB not connected')
        setDbStatus('error')
      }
    } catch {
      setDbMessage('Failed to reach API')
      setDbStatus('error')
    }
  }, [])

  useEffect(() => {
    void fetchHello()
    void fetchDbCheck()
  }, [fetchHello, fetchDbCheck])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border px-8 py-10 text-center">
        <h1 className="bg-gradient-to-br from-indigo-400 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
          {import.meta.env.VITE_APP_TITLE ?? 'My App'}
        </h1>
        <p className="mt-2 text-sm tracking-widest text-muted-foreground">
          React + Vite · Node.js · MySQL · Docker
        </p>
      </header>

      <main className="flex flex-1 flex-wrap items-start justify-center gap-6 p-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>API Health Check</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StatusBadge status={apiStatus} message={apiMessage} />
            <Button onClick={() => void fetchHello()} className="self-start">
              <RefreshCcw className="mr-2 h-4 w-4" /> Ping backend API
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Database Health Check</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StatusBadge status={dbStatus} message={dbMessage} />
            <Button onClick={() => void fetchDbCheck()} className="self-start">
              <RefreshCcw className="mr-2 h-4 w-4" /> Ping database
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
