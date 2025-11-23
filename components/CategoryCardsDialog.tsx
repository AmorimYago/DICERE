"use client"

import React, { useEffect, useState } from "react"
import CreateCardDialog from "./CreateCardDialog"

type ImageItem = {
  id: string
  name: string
  imageUrl: string | null
  isCustom?: boolean
  uploadedBy?: string | null
  order?: number
}

type Category = {
  id: string
  name: string
  displayName: string
  color?: string
}

export default function CategoryCardsDialog({
  open,
  onClose,
  category,
  session,
  onUpdated,
}: {
  open: boolean
  onClose: () => void
  category: Category | null
  session: any
  onUpdated?: () => void
}) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<ImageItem | null>(null)

  useEffect(() => {
    if (open && category) {
      fetchImages()
    } else {
      setImages([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category])

  const fetchImages = async () => {
    if (!category) return
    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${category.id}/images`, {
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok) {
        setImages(data)
      } else {
        console.error(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("Excluir este card? Essa ação não pode ser desfeita.")) return
    try {
      const res = await fetch(`/api/images?id=${imageId}`, {
        method: "DELETE",
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || "Erro ao deletar card")
        return
      }
      // refetch
      await fetchImages()
      onUpdated?.()
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar card")
    }
  }

  const handleEdit = (img: ImageItem) => {
    setEditing(img)
    setShowCreate(true)
  }

  const handleCreatedOrUpdated = async () => {
    setShowCreate(false)
    setEditing(null)
    await fetchImages()
    onUpdated?.()
  }

  if (!open || !category) return null

  // Função para evitar fechar modal pai ao clicar no modal filho
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <>
      {/* Overlay do modal pai */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal pai */}
      <div
        className="fixed inset-y-8 inset-x-4 z-50 max-w-4xl mx-auto bg-white rounded shadow-lg overflow-auto p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-cards-title"
        onClick={stopPropagation} // evita fechar ao clicar dentro
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="category-cards-title" className="text-lg font-semibold flex items-center gap-2">
            📚 {category.displayName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white"
              onClick={() => { setEditing(null); setShowCreate(true) }}
              aria-label="Adicionar novo card"
            >
              <span className="mr-2">＋</span> Novo Card
            </button>
            <button
              className="px-3 py-1 rounded border"
              onClick={onClose}
              aria-label="Fechar modal de cards"
            >
              Fechar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="bg-white rounded shadow p-3 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden mb-2">
                  {img.imageUrl ? (
                    <img src={img.imageUrl} alt={img.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📷</div>
                  )}
                </div>
                <div className="text-sm font-medium mb-2">{img.name}</div>

                <div className="flex gap-2">
                  {img.isCustom ? (
                    <>
                      <button
                        className="px-2 py-1 text-sm bg-yellow-100 rounded"
                        onClick={() => handleEdit(img)}
                        aria-label={`Editar card ${img.name}`}
                      >
                        Editar
                      </button>
                      <button
                        className="px-2 py-1 text-sm bg-red-100 rounded"
                        onClick={() => handleDelete(img.id)}
                        aria-label={`Excluir card ${img.name}`}
                      >
                        Excluir
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">Padrão</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal filho: CreateCardDialog */}
      {showCreate && category && (
        <CreateCardDialog
          open={showCreate}
          onClose={() => { setShowCreate(false); setEditing(null) }}
          categoryId={category.id}
          onSaved={handleCreatedOrUpdated}
          initialData={editing ?? undefined}
        />
      )}
    </>
  )
}