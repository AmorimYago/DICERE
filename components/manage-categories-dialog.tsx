"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Edit,
  Trash2,
  FolderPlus,
  Save,
  X,
  Palette
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
  displayName: string
  icon: string
  color: string
  description?: string
  isCustom: boolean
  _count?: {
    images: number
  }
}

interface ManageCategoriesDialogProps {
  onCategoryCreated?: () => void
}

const EMOJI_OPTIONS = ["📁", "🎨", "🎭", "🎪", "🎯", "🎲", "🎸", "🎹", "🎺", "🎻", "🏀", "⚽", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎿", "🛷", "🥌"]

const COLOR_OPTIONS = [
  { name: "Azul", value: "#3B82F6" },
  { name: "Laranja", value: "#F97316" },
  { name: "Amarelo", value: "#EAB308" },
  { name: "Verde", value: "#10B981" },
  { name: "Roxo", value: "#8B5CF6" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Vermelho", value: "#EF4444" },
  { name: "Cinza", value: "#6B7280" },
]

export function ManageCategoriesDialog({ onCategoryCreated }: ManageCategoriesDialogProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    icon: "📁",
    color: "#3B82F6",
    description: ""
  })

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      if (editingCategory) {
        // Atualizar categoria existente
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: formData.displayName,
            icon: formData.icon,
            color: formData.color,
            description: formData.description
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao atualizar categoria")
        }

        toast({
          title: "Sucesso!",
          description: "Categoria atualizada com sucesso"
        })
      } else {
        // Criar nova categoria
        const response = await fetch("/api/categories/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Erro ao criar categoria")
        }

        toast({
          title: "Sucesso!",
          description: "Categoria criada com sucesso"
        })

        onCategoryCreated?.()
      }

      // Reset form
      setFormData({
        name: "",
        displayName: "",
        icon: "📁",
        color: "#3B82F6",
        description: ""
      })
      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      displayName: category.displayName,
      icon: category.icon,
      color: category.color,
      description: category.description || ""
    })
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setFormData({
      name: "",
      displayName: "",
      icon: "📁",
      color: "#3B82F6",
      description: ""
    })
  }

  const handleDelete = async () => {
    if (!deletingCategory) return

    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao deletar categoria")
      }

      toast({
        title: "Sucesso!",
        description: "Categoria deletada com sucesso"
      })

      setDeletingCategory(null)
      fetchCategories()
      onCategoryCreated?.()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Gerenciar Categorias
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Gerenciar Categorias
            </DialogTitle>
            <DialogDescription>
              Crie e gerencie categorias personalizadas para organizar os pictogramas
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulário */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Interno *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: minha-categoria"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use apenas letras minúsculas, números e hífens
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome de Exibição *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="ex: Minha Categoria"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <div className="grid grid-cols-10 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`p-2 text-2xl rounded border-2 transition-all hover:scale-110 ${
                          formData.icon === emoji
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        disabled={loading}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`p-3 rounded border-2 transition-all hover:scale-105 ${
                          formData.color === color.value
                            ? "border-primary ring-2 ring-primary"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.value }}
                        disabled={loading}
                        title={color.name}
                      >
                        <span className="text-white text-xs font-semibold drop-shadow">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição opcional da categoria"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCategory ? "Atualizar" : "Criar"}
                  </Button>
                  {editingCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Categorias */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Categorias Existentes</h3>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {loading && categories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Carregando...
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma categoria encontrada
                  </p>
                ) : (
                  categories.map((category) => (
                    <Card key={category.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                              style={{ backgroundColor: category.color + "20" }}
                            >
                              {category.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold truncate">
                                  {category.displayName}
                                </h4>
                                {!category.isCustom && (
                                  <Badge variant="secondary" className="text-xs">
                                    Padrão
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {category.name}
                              </p>
                              {category.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {category.description}
                                </p>
                              )}
                              {category._count && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {category._count.images} imagens
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {category.isCustom && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingCategory(category)}
                                disabled={loading}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a categoria "{deletingCategory?.displayName}"?
              Esta ação não pode ser desfeita.
              {deletingCategory?._count && deletingCategory._count.images > 0 && (
                <span className="block mt-2 text-destructive font-semibold">
                  Atenção: Esta categoria possui {deletingCategory._count.images} imagens associadas.
                  Você precisa remover ou mover essas imagens antes de deletar a categoria.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading || (deletingCategory?._count?.images ?? 0) > 0}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}