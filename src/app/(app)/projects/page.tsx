import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FolderKanban, FileQuestion } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types/database'

type ProjectWithRFIs = Project & { rfis: { id: string; status: string }[] }

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projectsData } = await supabase
    .from('projects')
    .select(`
      *,
      rfis(id, status)
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const projects = (projectsData || []) as ProjectWithRFIs[]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage your construction projects and RFIs.</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-600 mb-4">Create your first project to start tracking RFIs.</p>
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const rfis = project.rfis || []
            const openRfis = rfis.filter(r => r.status === 'open' || r.status === 'pending').length
            const totalRfis = rfis.length

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-blue-300 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">{project.name}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            project.status === 'active' ? 'bg-green-100 text-green-700' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        {project.client_name && (
                          <p className="text-sm text-slate-600 mb-1">{project.client_name}</p>
                        )}
                        {project.address && (
                          <p className="text-sm text-slate-500">{project.address}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-500">
                            <FileQuestion className="h-4 w-4" />
                            <span className="font-medium">{totalRfis}</span>
                          </div>
                          <span className="text-xs text-slate-400">Total RFIs</span>
                        </div>
                        {openRfis > 0 && (
                          <div className="text-center">
                            <span className="font-medium text-yellow-600">{openRfis}</span>
                            <span className="text-xs text-slate-400 block">Open</span>
                          </div>
                        )}
                        <div className="text-slate-400 text-xs">
                          Created {formatDate(project.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

