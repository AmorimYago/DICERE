"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ImagePlus, X } from "lucide-react"

interface CreateCardDialogProps {
  categoryId: string
  categoryName: string
  onCardCreated?: () => void
}

export function CreateCardDialog({ categoryId, categoryName, onCardCreated }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  })
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError("")
      
      const fd = new FormData()
      fd.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no upload')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: data.url }))
    } catch (err: any) {
      setError(err.message || "Falha ao fazer upload da imagem")
      toast({
        title: "Erro",
        description: err.message || "Falha ao fazer upload da imagem",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.imageUrl) {
      setError("Imagem é obrigatória")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/categories/${categoryId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          imageUrl: formData.imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar card")
      }

      toast({
        title: "Sucesso!",
        description: "Card criado com sucesso"
      })

      // Reset form
      setFormData({ name: "", imageUrl: "" })
      setOpen(false)
      onCardCreated?.()
    } catch (err: any) {
      setError(err.message || "Erro ao criar card")
      toast({
        title: "Erro",
        description: err.message || "Erro ao criar card",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ name: "", imageUrl: "" })
    setError("")
    setActiveTab("upload")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) {
        handleCancel()
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ImagePlus className="h-4 w-4" />
          Adicionar Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Card</DialogTitle>
          <DialogDescription>
            Adicione um novo card à categoria "{categoryName}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Card *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Comer maçã"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex border-b">
              <button
                type="button"
                className={`pb-2 px-1 text-sm font-medium ${
                  activeTab === "upload"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("upload")}
                disabled={loading}
              >
                Upload
              </button>
              <button
                type="button"
                className={`pb-2 px-1 text-sm font-medium ${
                  activeTab === "url"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("url")}
                disabled={loading}
              >
                URL
              </button>
            </div>
            
            {activeTab === "upload" ? (
              <div className="space-y-2">
                <Label htmlFor="image-upload">Imagem do Card</Label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-xs text-gray-500">Upload</p>
                      </div>
                    )}
                    <input 
                      id="image-upload"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading || loading}
                    />
                  </label>
                  {uploading && (
                    <p className="text-sm text-muted-foreground">Enviando...</p>
                  )}
                  {formData.imageUrl && !uploading && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      disabled={loading}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Envie uma imagem do seu dispositivo
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="image-url">URL da Imagem</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/imagem.png"
                    disabled={loading}
                  />
                  {formData.imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-16 h-16 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading || !formData.name.trim() || !formData.imageUrl}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Card"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}