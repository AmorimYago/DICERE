
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface Child {
  id: string
  name: string
  birthDate?: string
  profilePhoto?: string
  notes?: string
  createdAt: string
  childAccess: any[]
  _count: {
    sequences: number
    reports: number
  }
}

interface CreateChildDialogProps {
  open: boolean
  onClose: () => void
  onChildCreated: (child: Child) => void
}

export function CreateChildDialog({ open, onClose, onChildCreated }: CreateChildDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    notes: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          birthDate: formData.birthDate || null,
          notes: formData.notes.trim() || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao criar perfil")
        return
      }

      // Create a child object in the expected format
      const newChild: Child = {
        ...data.child,
        childAccess: [],
        _count: {
          sequences: 0,
          reports: 0
        }
      }

      onChildCreated(newChild)
      setFormData({ name: "", birthDate: "", notes: "" })
    } catch (error) {
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", birthDate: "", notes: "" })
      setError("")
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Criança</DialogTitle>
          <DialogDescription>
            Crie um perfil para uma nova criança para começar a usar o AAC Comunicador.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Criança *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nome completo da criança"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Informações adicionais sobre a criança, necessidades especiais, etc."
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Perfil"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
