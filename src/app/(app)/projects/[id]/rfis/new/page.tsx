'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import type { Contact } from '@/types/database'

export default function NewRFIPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignedToId, setAssignedToId] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    async function loadContacts() {
      const supabase = createClient()
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('project_id', projectId)
      setContacts((data || []) as Contact[])
    }
    loadContacts()
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const rfiData = {
        user_id: user.id,
        project_id: projectId,
        subject,
        question,
        priority,
        due_date: dueDate || null,
        assigned_to_id: assignedToId || null,
      }

      const { data, error } = await supabase
        .from('rfis')
        .insert(rfiData as never)
        .select()
        .single()

      if (error) throw error

      router.push(`/projects/${projectId}/rfis/${(data as { id: string }).id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create RFI')
    } finally {
      setLoading(false)
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const contactOptions = [
    { value: '', label: 'Select a contact (optional)' },
    ...contacts.map(c => ({
      value: c.id,
      label: `${c.name}${c.company ? ` (${c.company})` : ''}`,
    })),
  ]

  return (
    <div className="max-w-2xl">
      <Link 
        href={`/projects/${projectId}`}
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to project
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New RFI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Input
              label="Subject"
              placeholder="e.g., Clarification on electrical layout"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <Textarea
              label="Question"
              placeholder="Describe the information you need..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={priorityOptions}
              />

              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <Select
              label="Assign To"
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              options={contactOptions}
            />

            {contacts.length === 0 && (
              <p className="text-sm text-slate-500">
                No contacts in this project yet.{' '}
                <Link href={`/projects/${projectId}/contacts/new`} className="text-blue-600 hover:underline">
                  Add a contact
                </Link>
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={loading}>
                Create RFI
              </Button>
              <Link href={`/projects/${projectId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
