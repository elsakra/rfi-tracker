import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FolderKanban, 
  FileQuestion, 
  Clock, 
  CheckCircle, 
  Plus,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { RFI, Project } from '@/types/database'

type RFIWithProject = RFI & { projects: { id: string; name: string } }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch projects count
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch RFIs with stats
  const { data: rfisData } = await supabase
    .from('rfis')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const rfis = (rfisData || []) as RFIWithProject[]
  
  const openRfis = rfis.filter(r => r.status === 'open' || r.status === 'pending')
  const overdueRfis = rfis.filter(r => 
    r.due_date && 
    new Date(r.due_date) < new Date() && 
    r.status !== 'closed'
  )
  const recentRfis = rfis.slice(0, 5)

  // Fetch recent projects
  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })
    .limit(3)

  const projects = (projectsData || []) as Project[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Overview of your projects and RFIs</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Projects</p>
                <p className="text-2xl font-bold text-slate-900">{projectsCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileQuestion className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Open RFIs</p>
                <p className="text-2xl font-bold text-slate-900">{openRfis.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-slate-900">{overdueRfis.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Closed This Month</p>
                <p className="text-2xl font-bold text-slate-900">
                  {rfis.filter(r => {
                    if (!r.closed_at) return false
                    const closedDate = new Date(r.closed_at)
                    const now = new Date()
                    return closedDate.getMonth() === now.getMonth() && 
                           closedDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent RFIs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent RFIs</CardTitle>
            <Link href="/rfis" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentRfis.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileQuestion className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No RFIs yet</p>
                <p className="text-sm mt-1">Create your first project to start tracking RFIs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRfis.map((rfi) => {
                  const isOverdue = rfi.due_date && 
                    new Date(rfi.due_date) < new Date() && 
                    rfi.status !== 'closed'
                  
                  return (
                    <Link
                      key={rfi.id}
                      href={`/projects/${rfi.projects.id}/rfis/${rfi.id}`}
                      className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-slate-500">
                              RFI-{rfi.rfi_number}
                            </span>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              rfi.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                              rfi.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                              rfi.status === 'answered' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {rfi.status}
                            </span>
                            {isOverdue && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                overdue
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-900 truncate">{rfi.subject}</p>
                          <p className="text-xs text-slate-500">{rfi.projects.name}</p>
                        </div>
                        <div className="text-xs text-slate-400 flex-shrink-0">
                          {formatDate(rfi.created_at)}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <Link href="/projects" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No projects yet</p>
                <Link href="/projects/new" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create your first project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 truncate">{project.name}</p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            project.status === 'active' ? 'bg-green-100 text-green-700' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        {project.client_name && (
                          <p className="text-xs text-slate-500">{project.client_name}</p>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex-shrink-0">
                        {formatDate(project.updated_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for empty state */}
      {projectsCount === 0 && (
        <Card className="mt-6 border-dashed">
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Get started with RFI Tracker</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first project to start tracking RFIs. You'll be able to add questions, 
              assign them to contacts, and track responses.
            </p>
            <Link href="/projects/new">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

