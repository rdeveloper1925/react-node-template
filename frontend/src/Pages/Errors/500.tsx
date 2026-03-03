import { useNavigate } from 'react-router-dom'
import { ServerCrash, ArrowLeft, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10">
        <ServerCrash className="h-12 w-12 text-red-500" strokeWidth={1.5} />
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-red-500">500</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Internal server error</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        Something went wrong on our end. We're already looking into it — please try again in a moment.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
        <Button onClick={() => window.location.reload()}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Try again
        </Button>
      </div>
    </div>
  )
}
