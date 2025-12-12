import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import type { Contact } from '@/types/database'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*, projects(id, name)')
    .eq('user_id', user!.id)
    .order('name', { ascending: true }) as { data: (Contact & { projects: { id: string; name: string } | null })[] | null }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600">Manage your project contacts.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({contacts?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!contacts || contacts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No contacts yet</p>
              <p className="text-sm mt-1">Add contacts from a project page</p>
            </div>
          ) : (
            <div className="divide-y">
              {contacts.map((contact) => {
                const project = contact.projects
                return (
                  <div key={contact.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{contact.name}</p>
                      {contact.company && (
                        <p className="text-sm text-slate-600">{contact.company}</p>
                      )}
                      {contact.role && (
                        <p className="text-sm text-slate-500">{contact.role}</p>
                      )}
                      {project && (
                        <Link 
                          href={`/projects/${project.id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {project.name}
                        </Link>
                      )}
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      {contact.email && <p>{contact.email}</p>}
                      {contact.phone && <p>{contact.phone}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

