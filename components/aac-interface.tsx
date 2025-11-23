"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Volume2, 
  ArrowLeft, 
  Delete, 
  Home,
  Play,
  RotateCcw,
  MessageCircle,
  Heart
} from "lucide-react"
import Link from "next/link"
import { tts } from "@/lib/tts"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Child {
  id: string
  name: string
  profilePhoto?: string | null
}

interface Category {
  id: string
  name: string
  displayName: string
  icon: string
  imageUrl?: string  // ✅ ADICIONADO
  color: string
  order: number
  _count?: {
    images: number
  }
}

interface ImageItem {
  id: string
  name: string
  imageUrl: string
  audioUrl?: string
  categoryId: string
  order: number
  category?: {
    name: string
    displayName: string
    color: string
  }
}

interface AAC_InterfaceProps {
  child: Child
  userId: string
}

export function AAC_Interface({ child, userId }: AAC_InterfaceProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryImages, setCategoryImages] = useState<ImageItem[]>([])
  const [sentenceBar, setSentenceBar] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const sentenceBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryImages = async (categoryId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories/${categoryId}/images`)
      if (response.ok) {
        const data = await response.json()
        setCategoryImages(data)
      }
    } catch (error) {
      console.error("Error fetching category images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    fetchCategoryImages(category.id)
  }

  const handleImageSelect = async (image: ImageItem) => {
    // Add to sentence bar
    setSentenceBar(prev => [...prev, image])
    
    // Play individual sound
    if (tts) {
      tts.speak(image.name, 1.1)
    }

    // Auto-scroll sentence bar
    setTimeout(() => {
      if (sentenceBarRef.current) {
        sentenceBarRef.current.scrollLeft = sentenceBarRef.current.scrollWidth
      }
    }, 100)
  }

  const handleBackHome = () => {
    setSelectedCategory(null)
    setCategoryImages([])
  }

  const handleBackspace = () => {
    setSentenceBar(prev => prev.slice(0, -1))
  }

  const handleClearSentence = () => {
    setSentenceBar([])
  }

  const handleSpeak = async () => {
    if (sentenceBar.length === 0 || !tts) return
    
    setSpeaking(true)
    const sentence = sentenceBar.map(img => img.name).join(" ")
    
    // Log the sequence to database
    try {
      await fetch("/api/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          images: sentenceBar.map(img => img.id)
        })
      })
    } catch (error) {
      console.error("Error logging sequence:", error)
    }
    
    tts.speak(sentence, 0.9)
    
    // Reset speaking state after estimated speaking time
    setTimeout(() => setSpeaking(false), sentence.length * 100 + 1000)
  }

  // ✅ FUNÇÃO CORRIGIDA - Recebe o objeto Category completo
  const renderCategoryIcon = (category: Category, sizeClass: string = "h-12 w-12") => {
    if (category.imageUrl) {
      return (
        <Image
          src={category.imageUrl}
          alt={category.displayName}
          width={48}
          height={48}
          className={`${sizeClass} object-contain`}
          onError={(e) => {
            console.error(`Erro ao carregar imagem da categoria: ${category.displayName}`)
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    }
    
    // Fallback para emoji
    return (
      <span className={sizeClass === "h-12 w-12" ? "text-4xl" : "text-2xl"}>
        {category.icon || '📁'}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header with Sentence Bar */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Top Row - Navigation */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBackHome}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Categorias
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">{child.name}</p>
                <p className="text-xs text-gray-500">Comunicando</p>
              </div>
              {child.profilePhoto && (
                <img 
                  src={child.profilePhoto} 
                  alt={child.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
                />
              )}
            </div>
          </div>
          
          {/* Sentence Bar */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <div className="flex items-center justify-between p-3">
              <div 
                ref={sentenceBarRef}
                className="flex-1 flex items-center space-x-2 overflow-x-auto scrollbar-hide"
                style={{ minHeight: '60px' }}
              >
                <AnimatePresence>
                  {sentenceBar.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center text-gray-400 h-full"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Toque nas imagens para construir sua mensagem...</span>
                    </motion.div>
                  ) : (
                    sentenceBar.map((image, index) => (
                      <motion.div
                        key={`${image.id}-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <Card className="border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-2">
                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mb-1">
                              <Image
                                src={image.imageUrl}
                                alt={image.name}
                                fill
                                className="object-contain"
                                sizes="48px"
                                onError={(e) => {
                                  console.error(`Erro ao carregar imagem: ${image.name}`)
                                }}
                              />
                            </div>
                            <p className="text-xs font-medium text-center text-gray-700 leading-tight">
                              {image.name}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              
              {/* Sentence Bar Controls */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackspace}
                  disabled={sentenceBar.length === 0}
                  className="border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <Delete className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSentence}
                  disabled={sentenceBar.length === 0}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSpeak}
                  disabled={sentenceBar.length === 0 || speaking}
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
                >
                  {speaking ? (
                    <>
                      <div className="animate-pulse h-4 w-4 mr-2 bg-white rounded-full" />
                      Falando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Falar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedCategory ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div 
                  className="p-3 rounded-xl shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedCategory.color + '30' }}
                >
                  {/* ✅ CORRIGIDO - Passa o objeto completo */}
                  {renderCategoryIcon(selectedCategory, "h-8 w-8")}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.displayName}</h2>
                  <p className="text-sm text-gray-500">{categoryImages.length} itens disponíveis</p>
                </div>
              </div>
            </div>
            
            {categoryImages.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma imagem encontrada nesta categoria</p>
                <p className="text-sm mt-2">Adicione imagens no dashboard para começar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <AnimatePresence>
                  {categoryImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <Card 
                        onClick={() => handleImageSelect(image)}
                        className="border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        style={{ 
                          borderColor: `${selectedCategory.color}40`,
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                            {image.imageUrl ? (
                              <Image
                                src={image.imageUrl}
                                alt={image.name}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                onError={(e) => {
                                  console.error(`Erro ao carregar imagem: ${image.name}`)
                                  // Fallback para placeholder
                                  e.currentTarget.src = '/placeholder-image.png'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">
                                ❓
                              </div>
                            )}
                          </div>
                          <p className="text-center font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                            {image.name}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Escolha uma categoria</h2>
              <p className="text-lg text-gray-600">Toque na categoria para ver as opções de comunicação</p>
            </div>
            
            {categories.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma categoria disponível</p>
                <p className="text-sm mt-2">Execute o script de seed para popular as categorias padrão!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                <AnimatePresence>
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <Card 
                        onClick={() => handleCategorySelect(category)}
                        className="border-2 border-gray-200 hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm h-full"
                        style={{ 
                          borderColor: `${category.color}40`,
                        }}
                      >
                        <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                          <div className="space-y-4">
                            <div 
                              className="mx-auto p-4 rounded-xl shadow-lg flex items-center justify-center w-20 h-20"
                              style={{ backgroundColor: category.color + '30' }}
                            >
                              {/* ✅ CORRIGIDO - Passa o objeto completo */}
                              {renderCategoryIcon(category, "h-12 w-12")}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">{category.displayName}</h3>
                              <Badge 
                                variant="secondary" 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: category.color + '20',
                                  color: category.color
                                }}
                              >
                                {category._count?.images || 0} itens
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}