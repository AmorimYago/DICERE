"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  ArrowLeft, 
  Calendar,
  MessageCircle,
  TrendingUp,
  Download,
  Mail,
  Clock,
  MessageSquare,
  Eye,
  Plus,
  Send,
  Heart,
  Activity
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Child {
  id: string
  name: string
  profilePhoto?: string | null
}

interface ReportData {
  summary: {
    totalSequences: number
    totalImages: number
    totalComments: number
    averageSequenceLength: number
  }
  mostUsedWords: Array<{
    word: string
    count: number
  }>
  categoryUsage: Array<{
    category: string
    count: number
  }>
  dailyBreakdown: Array<{
    date: string
    sequences: number
    images: number
    comments: number
  }>
  sequences: Array<{
    id: string
    timestamp: string
    items: Array<{
      order: number
      image: {
        id: string
        name: string
        imageUrl: string
        category?: {
          displayName: string
          color: string
        }
      }
    }>
    comments: Array<{
      id: string
      content: string
      createdAt: string
      user: {
        name: string
        email: string
      }
    }>
  }>
  period: {
    startDate: string
    endDate: string
  }
}

interface ReportsInterfaceProps {
  child: Child
  userId: string
}

export function ReportsInterface({ child, userId }: ReportsInterfaceProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
const [endDate, setEndDate] = useState<string>("")
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(false)

  // Paginação no frontend
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  // Flag para evitar refetch repetido tentando pegar "tudo"
  const [didRequestAll, setDidRequestAll] = useState(false)

  useEffect(() => {
    setPage(1) // resetar pagina ao mudar período
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const baseParams = new URLSearchParams({ startDate, endDate })
      // 1) fetch inicial (padrão)
      const initialResp = await fetch(`/api/reports/${child.id}?${baseParams}`)
      if (!initialResp.ok) {
        console.error("Erro HTTP ao buscar relatório:", initialResp.status)
        setLoading(false)
        return
      }

      const initialData = await initialResp.json()
      console.log("[REPORT] initialData:", initialData)

      // guarda o que veio
      let data = initialData as ReportData

      // totalReport pode vir em summary.totalSequences ou em um campo total
      let reportedTotal = data?.summary?.totalSequences ?? (data as any).total ?? null
      const returnedCount = Array.isArray(data?.sequences) ? data.sequences.length : 0

      // Se o servidor já retornou tudo, usa diretamente
      if (reportedTotal == null || reportedTotal <= returnedCount) {
        setReportData(data)
        setDidRequestAll(true)
        setLoading(false)
        return
      }

      // Caso o servidor indique mais itens do que retornou, tenta buscar por paginação
      // Tentaremos usar page & pageSize. pageSize inicializamos em 50 para reduzir requisições, mas respeite limite razoável.
      const pageSizeFetch = 50
      let collected = data.sequences ? [...data.sequences] : []
      let currentPage = 1
      const maxLoops = 100 // limite de segurança

      // se a resposta inicial já veio paginada (ex: retornou page info), ajusta page inicial
      // Agora iniciamos o loop para buscar páginas até coletar reportedTotal ou até não receber mais items.
      while ((reportedTotal === null || collected.length < reportedTotal) && currentPage < maxLoops) {
        currentPage++
        const params = new URLSearchParams({ startDate, endDate, page: String(currentPage), pageSize: String(pageSizeFetch) })
        const resp = await fetch(`/api/reports/${child.id}?${params}`)
        if (!resp.ok) {
          console.warn(`[REPORT] falha ao buscar página ${currentPage}:`, resp.status)
          break
        }
        const pageData = await resp.json()
        console.log(`[REPORT] page ${currentPage} data:`, pageData)
        const pageItems = Array.isArray(pageData.sequences) ? pageData.sequences : []
        if (pageItems.length === 0) break
        collected = collected.concat(pageItems)

        // se o endpoint responder um total atualizado, use-o
        const pageReportedTotal = pageData?.summary?.totalSequences ?? (pageData as any).total ?? reportedTotal
        if (pageReportedTotal != null) {
          // atualiza reportedTotal caso venha diferente
          reportedTotal = pageReportedTotal
        }

        // proteção: se já pegamos mais que 2000 itens paramos (evitar loop infinito)
        if (collected.length > 2000) break
      }

      // se conseguimos coletar algo extra, atualiza reportData com as sequências completas
      if (collected.length > returnedCount) {
        const newData = { ...data, sequences: collected }
        setReportData(newData)
      } else {
        // não conseguimos mais itens, mantemos o que veio
        setReportData(data)
      }
      setDidRequestAll(true)
    } catch (err) {
      console.error("Erro fetching report:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (sequenceId: string) => {
    if (!newComment.trim()) return

    setAddingComment(true)
    try {
      const response = await fetch(`/api/sequences/${sequenceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() })
      })

      if (response.ok) {
        setNewComment("")
        setSelectedSequence(null)
        setCommentSuccess(true)
        setTimeout(() => setCommentSuccess(false), 3000)
        // Refresh report to show new comment
        // também resetamos a flag para garantir que, se faltar itens, tentamos recarregar tudo novamente
        setDidRequestAll(false)
        fetchReport()
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setAddingComment(false)
    }
  }

  const exportToPDF = () => {
    // Implement PDF export functionality
    window.print()
  }

  const shareByEmail = () => {
    const subject = `Relatório de Comunicação - ${child.name}`
    const body = `Relatório de comunicação AAC para ${child.name}
    
Período: ${format(new Date(startDate), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(endDate), 'dd/MM/yyyy', { locale: ptBR })}

Resumo:
- Total de comunicações: ${reportData?.summary.totalSequences || 0}
- Total de imagens usadas: ${reportData?.summary.totalImages || 0}
- Média de imagens por sequência: ${reportData?.summary.averageSequenceLength || 0}

Gerado pelo AAC Comunicador`

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Paginação: calcula as sequências a exibir na página atual
  const paginatedSequences = reportData?.sequences
    ? reportData.sequences.slice((page - 1) * pageSize, page * pageSize)
    : []

  const totalSequencesCount = reportData?.summary?.totalSequences ?? (reportData?.sequences?.length ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalSequencesCount / pageSize))

  if (!reportData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Erro ao carregar relatórios</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Relatórios - {child.name}</h1>
                  <p className="text-sm text-gray-500">Análise de comunicação AAC</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={shareByEmail}>
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Filter */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Período do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => { setDidRequestAll(false); fetchReport() }} 
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Carregando..." : "Atualizar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {commentSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Comentário adicionado com sucesso! ✅
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Comunicações</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData?.summary.totalSequences}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Imagens Usadas</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData?.summary.totalImages}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Comentários</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData?.summary.totalComments}</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Média por Frase</p>
                      <p className="text-2xl font-bold text-gray-900">{reportData?.summary.averageSequenceLength}</p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Most Used Words */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Palavras Mais Usadas</CardTitle>
                  <CardDescription>Top 10 palavras comunicadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData?.mostUsedWords.map((item, index) => (
                      <div key={item.word} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{item.word}</span>
                        </div>
                        <Badge variant="secondary">{item.count}x</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Uso por Categoria</CardTitle>
                  <CardDescription>Distribuição por categorias AAC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData?.categoryUsage.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.category}</span>
                        <Badge variant="secondary">{item.count} usos</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Communication Sequences */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Histórico de Comunicações
                </CardTitle>
                <CardDescription>
                  Todas as sequências comunicadas no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportData?.sequences.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma comunicação encontrada no período selecionado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedSequences.map((sequence) => (
                      <div key={sequence.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm text-gray-600">
                            {formatDateTime(sequence.timestamp)}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSequence(selectedSequence === sequence.id ? null : sequence.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {selectedSequence === sequence.id ? 'Ocultar' : 'Ver Detalhes'}
                            </Button>
                            {sequence.comments.length === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSequence(sequence.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Comentar
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Sequence Images */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {sequence.items.map((item) => (
                            <div key={`${sequence.id}-${item.order}`} className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-gray-200">
                              <div className="relative w-8 h-8 bg-gray-100 rounded overflow-hidden">
                                <Image
                                  src={item.image.imageUrl}
                                  alt={item.image.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                              <span className="text-sm font-medium">{item.image.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Generated Sentence */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-600 mb-1">Frase comunicada:</p>
                          <p className="font-semibold text-blue-900">
                            "{sequence.items.map(item => item.image.name).join(' ')}"
                          </p>
                        </div>

                        {/* Comments */}
                        {sequence.comments.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {sequence.comments.map((comment) => (
                              <div key={comment.id} className="bg-green-50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatDateTime(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment Form */}
                        <AnimatePresence>
                          {selectedSequence === sequence.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t pt-3 mt-3"
                            >
                              <div className="space-y-3">
                                <Label htmlFor={`comment-${sequence.id}`}>
                                  Adicionar comentário sobre esta comunicação:
                                </Label>
                                <Textarea
                                  id={`comment-${sequence.id}`}
                                  placeholder="Ex: Após comunicar 'quero água', levei a criança até o bebedouro e ela bebeu bastante água..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleAddComment(sequence.id)}
                                    disabled={addingComment || !newComment.trim()}
                                    size="sm"
                                  >
                                    {addingComment ? (
                                      <>
                                        <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full" />
                                        Salvando...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-3 w-3 mr-1" />
                                        Salvar Comentário
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedSequence(null)
                                      setNewComment("")
                                    }}
                                    size="sm"
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    {/* Controles de paginação */}
                    {totalSequencesCount > pageSize && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Mostrando {Math.min((page - 1) * pageSize + 1, totalSequencesCount)} - {Math.min(page * pageSize, totalSequencesCount)} de {totalSequencesCount}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                          <div className="text-sm">{page} / {totalPages}</div>
                          <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Próxima</Button>
                        </div>
                      </div>
                    )}

                    {/* Se o backend reporta mais itens no total mas não foi possível trazer todos, permite tentar carregar tudo manualmente */}
                    {reportData && reportData.summary.totalSequences > (reportData.sequences?.length ?? 0) && (
                      <div className="mt-4 text-sm text-yellow-700">
                        Observação: O servidor indica {reportData.summary.totalSequences} comunicações, mas apenas {reportData.sequences.length} foram retornadas. <Button variant="ghost" size="sm" onClick={() => { setDidRequestAll(false); fetchReport(); }}>Tentar carregar todas</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}