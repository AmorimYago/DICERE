"use client"

import React, { useState, useEffect } from "react"

type InitialData = {
  id: string
  name: string
  imageUrl?: string | null
}

export default function CreateCardDialog({
  open,
  onClose,
  categoryId,
  onSaved,
  initialData,
}: {
  open: boolean
  onClose: () => void
  categoryId: string
  onSaved?: () => void
  initialData?: InitialData
}) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl ?? null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(initialData?.name ?? "")
    setPreview(initialData?.imageUrl ?? null)
    setFile(null)
  }, [initialData, open])

  if (!open) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(initialData?.imageUrl ?? null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || (!file && !preview)) {
      alert("Nome e imagem são obrigatórios")
      return
    }

    setSaving(true)
    try {
      let imageUrl = preview

      // If user selected a new file, upload it
      if (file) {
        const fd = new FormData()
        fd.append("file", file)
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) {
          alert(uploadData?.error || "Erro no upload")
          setSaving(false)
          return
        }
        imageUrl = uploadData.url
      }

      if (initialData?.id) {
        // Edit existing card
        const res = await fetch("/api/images", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: initialData.id,
            name,
            imageUrl,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data?.error || "Erro ao atualizar card")
          setSaving(false)
          return
        }
      } else {
        // Create new card within category
        const res = await fetch(`/api/categories/${categoryId}/images`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            imageUrl,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          alert(data?.error || "Erro ao criar card")
          setSaving(false)
          return
        }
      }

      onSaved?.()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar card")
    } finally {
      setSaving(false)
    }
  }

  // Evita fechar o modal ao clicar dentro dele
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Overlay com z-index maior que o modal pai */}
      <div 
        className="fixed inset-0 z-[100]" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal com z-index ainda maior */}
      <div 
        className="fixed inset-y-20 inset-x-4 z-[101] max-w-lg mx-auto bg-white rounded shadow-lg p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={handleContentClick}
      >
        <h4 id="dialog-title" className="text-lg font-semibold mb-3">
          {initialData ? "Editar Card" : "Novo Card"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="card-title" className="block text-sm font-medium mb-1">
              Título
            </label>
            <input
              id="card-title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Digite o título do card"
              required
            />
          </div>

          <div>
            <label htmlFor="card-image" className="block text-sm font-medium mb-1">
              Imagem
            </label>
            <input 
              id="card-image"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              aria-describedby="image-help"
            />
            <p id="image-help" className="text-xs text-gray-500 mt-1">
              Selecione uma imagem para representar este card
            </p>
            
            {preview && (
              <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                <img 
                  src={preview} 
                  alt="Pré-visualização do card" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1 border rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}