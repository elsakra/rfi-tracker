import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { RFI } from '@/types/database'

type RFIWithProject = RFI & { projects: { id: string; name: string } }

export default async function AllRFIsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rfisData } = await supabase
    .from('rfis')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const rfis = (rfisData || []) as RFIWithProject[]

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-blue-100 text-blue-700',
    answered: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All RFIs</h1>
        <p className="text-slate-600">View all RFIs across your projects.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RFIs ({rfis?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {rfis.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileQuestion className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No RFIs yet</p>
              <p className="text-sm mt-1">Create an RFI from a project page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rfis.map((rfi) => {
                const project = rfi.projects
                return (
                  <Link
                    key={rfi.id}
                    href={`/projects/${project.id}/rfis/${rfi.id}`}
                    className="block p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-500">
                            RFI-{rfi.rfi_number}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[rfi.status as keyof typeof statusColors]}`}>
                            {rfi.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[rfi.priority as keyof typeof priorityColors]}`}>
                            {rfi.priority}
                          </span>
                        </div>
                        <p className="font-medium text-slate-900">{rfi.subject}</p>
                        <p className="text-sm text-slate-500 mt-1">{project.name}</p>
                      </div>
                      <div className="text-right text-sm text-slate-500 flex-shrink-0">
                        {rfi.due_date && (
                          <p className={new Date(rfi.due_date) < new Date() && rfi.status !== 'closed' ? 'text-red-600' : ''}>
                            Due {formatDate(rfi.due_date)}
                          </p>
                        )}
                        <p className="text-xs">{formatDate(rfi.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

