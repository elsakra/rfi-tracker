'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { RFI, Contact, Project } from '@/types/database'

export default function RFIDetailPage({ params }: { params: Promise<{ id: string; rfiId: string }> }) {
  const { id: projectId, rfiId } = use(params)
  const [rfi, setRfi] = useState<RFI | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      const { data: rfiData, error: rfiError } = await supabase
        .from('rfis')
        .select('*')
        .eq('id', rfiId)
        .single()
      
      if (rfiError || !rfiData) {
        router.push(`/projects/${projectId}`)
        return
      }

      const typedRfi = rfiData as unknown as RFI
      setRfi(typedRfi)
      setAnswer(typedRfi.answer || '')
      setStatus(typedRfi.status)

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()
      setProject(projectData as unknown as Project | null)

      if (typedRfi.assigned_to_id) {
        const { data: contactData } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', typedRfi.assigned_to_id)
          .single()
        setContact(contactData as unknown as Contact | null)
      }

      setLoading(false)
    }
    loadData()
  }, [projectId, rfiId, router])

  const handleSaveAnswer = async () => {
    if (!rfi) return
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const updates: Partial<RFI> = { answer }
      
      if (answer && rfi.status === 'open') {
        updates.status = 'answered'
        updates.answered_at = new Date().toISOString()
        setStatus('answered')
      }

      const { error } = await supabase
        .from('rfis')
        .update(updates as never)
        .eq('id', rfiId)

      if (error) throw error
      setRfi({ ...rfi, ...updates })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!rfi) return
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const updates: Partial<RFI> = { status: newStatus as RFI['status'] }
      
      if (newStatus === 'closed') {
        updates.closed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('rfis')
        .update(updates as never)
        .eq('id', rfiId)

      if (error) throw error
      setRfi({ ...rfi, ...updates })
      setStatus(newStatus)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this RFI?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('rfis')
        .delete()
        .eq('id', rfiId)

      if (error) throw error
      router.push(`/projects/${projectId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!rfi || !project) return null

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'answered', label: 'Answered' },
    { value: 'closed', label: 'Closed' },
  ]

  const statusColors: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-blue-100 text-blue-700',
    answered: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl">
      <Link 
        href={`/projects/${projectId}`}
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to {project.name}
      </Link>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-slate-500">RFI-{rfi.rfi_number}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[status] || statusColors.open}`}>
              {status}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[rfi.priority] || priorityColors.medium}`}>
              {rfi.priority}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{rfi.subject}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${projectId}/rfis/${rfiId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700">{rfi.question}</p>
            </CardContent>
          </Card>

          {/* Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Answer</CardTitle>
            </CardHeader>
            <CardContent>
              {status === 'closed' ? (
                <p className="whitespace-pre-wrap text-slate-700">{rfi.answer || 'No answer provided'}</p>
              ) : (
                <>
                  <Textarea
                    placeholder="Enter the response to this RFI..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={5}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSaveAnswer} loading={saving}>
                      Save Answer
                    </Button>
                    {answer && status !== 'closed' && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleStatusChange('closed')}
                        loading={saving}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Close RFI
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                options={statusOptions}
                disabled={saving}
              />
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {contact && (
                <div>
                  <span className="text-slate-500">Assigned to:</span>
                  <p className="font-medium text-slate-900">{contact.name}</p>
                  {contact.company && <p className="text-slate-500">{contact.company}</p>}
                </div>
              )}
              {rfi.due_date && (
                <div>
                  <span className="text-slate-500">Due date:</span>
                  <p className={`font-medium ${new Date(rfi.due_date) < new Date() && status !== 'closed' ? 'text-red-600' : 'text-slate-900'}`}>
                    {formatDateTime(rfi.due_date)}
                  </p>
                </div>
              )}
              <div>
                <span className="text-slate-500">Created:</span>
                <p className="text-slate-900">{formatDateTime(rfi.created_at)}</p>
              </div>
              {rfi.answered_at && (
                <div>
                  <span className="text-slate-500">Answered:</span>
                  <p className="text-slate-900">{formatDateTime(rfi.answered_at)}</p>
                </div>
              )}
              {rfi.closed_at && (
                <div>
                  <span className="text-slate-500">Closed:</span>
                  <p className="text-slate-900">{formatDateTime(rfi.closed_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
