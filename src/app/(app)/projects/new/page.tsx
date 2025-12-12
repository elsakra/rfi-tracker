'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientName, setClientName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const projectData = {
        user_id: user.id,
        name,
        description: description || null,
        client_name: clientName || null,
        address: address || null,
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData as never)
        .select()
        .single()

      if (error) throw error

      router.push(`/projects/${(data as { id: string }).id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link 
        href="/projects"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to projects
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Input
              label="Project Name"
              placeholder="e.g., Downtown Office Renovation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Client Name"
              placeholder="e.g., ABC Development Corp"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />

            <Input
              label="Address"
              placeholder="e.g., 123 Main St, New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Textarea
              label="Description"
              placeholder="Brief description of the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={loading}>
                Create Project
              </Button>
              <Link href="/projects">
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
