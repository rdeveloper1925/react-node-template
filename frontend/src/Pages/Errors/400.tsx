import { useNavigate } from 'react-router-dom'
import { TriangleAlert, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BadRequestPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10">
        <TriangleAlert className="h-12 w-12 text-yellow-500" strokeWidth={1.5} />
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">400</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Bad request</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        The request couldn't be understood by the server. Please check your input and try again.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go back
        </Button>
        <Button onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" /> Back to home
        </Button>
      </div>
    </div>
  )
}
