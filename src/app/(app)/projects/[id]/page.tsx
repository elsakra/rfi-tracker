import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, FileQuestion, Users, Settings } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project, RFI, Contact } from '@/types/database'

type RFIWithContact = RFI & { contacts: { name: string; company?: string } | null }

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projectData, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  const project = projectData as Project | null

  if (error || !project) {
    notFound()
  }

  const { data: rfisData } = await supabase
    .from('rfis')
    .select('*, contacts(name, company)')
    .eq('project_id', id)
    .order('rfi_number', { ascending: false })

  const rfis = (rfisData || []) as RFIWithContact[]

  const { data: contactsData } = await supabase
    .from('contacts')
    .select('*')
    .eq('project_id', id)

  const contacts = (contactsData || []) as Contact[]

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
      <Link 
        href="/projects"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to projects
      </Link>

      {/* Project Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-700' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {project.status}
            </span>
          </div>
          {project.client_name && (
            <p className="text-slate-600">{project.client_name}</p>
          )}
          {project.address && (
            <p className="text-sm text-slate-500">{project.address}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${id}/rfis/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New RFI
            </Button>
          </Link>
          <Link href={`/projects/${id}/settings`}>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* RFIs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                RFIs ({rfis?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rfis.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileQuestion className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>No RFIs yet</p>
                  <Link href={`/projects/${id}/rfis/new`} className="mt-4 inline-block">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Create first RFI
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {rfis.map((rfi) => (
                    <Link
                      key={rfi.id}
                      href={`/projects/${id}/rfis/${rfi.id}`}
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
                          {rfi.contacts && (
                            <p className="text-sm text-slate-500 mt-1">
                              Assigned to: {rfi.contacts.name}
                              {rfi.contacts.company && ` (${rfi.contacts.company})`}
                            </p>
                          )}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Contacts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Contacts ({contacts?.length || 0})
              </CardTitle>
              <Link href={`/projects/${id}/contacts/new`}>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-sm text-slate-500">No contacts yet</p>
              ) : (
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((contact) => (
                    <div key={contact.id} className="text-sm">
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      {contact.company && (
                        <p className="text-slate-500">{contact.company}</p>
                      )}
                      {contact.role && (
                        <p className="text-xs text-slate-400">{contact.role}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <span className="text-slate-500">Created:</span>{' '}
                <span className="text-slate-900">{formatDate(project.created_at)}</span>
              </div>
              <div>
                <span className="text-slate-500">Last updated:</span>{' '}
                <span className="text-slate-900">{formatDate(project.updated_at)}</span>
              </div>
              {project.description && (
                <div className="pt-2 border-t mt-3">
                  <p className="text-slate-600">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

