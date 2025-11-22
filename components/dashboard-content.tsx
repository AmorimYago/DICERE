
"use client"

import { useState, useEffect } from "react"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarInitial } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Users, 
  Plus, 
  BarChart3, 
  Settings, 
  LogOut,
  Calendar,
  Activity,
  Heart,
  User
} from "lucide-react"
import Link from "next/link"
import { CreateChildDialog } from "@/components/create-child-dialog"

interface Child {
  id: string
  name: string
  birthDate?: string
  profilePhoto?: string
  notes?: string
  createdAt: string
  childAccess: Array<{
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }>
  _count: {
    sequences: number
    reports: number
  }
}

interface DashboardContentProps {
  session: Session
}

export function DashboardContent({ session }: DashboardContentProps) {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/children")
      if (response.ok) {
        const data = await response.json()
        setChildren(data)
      }
    } catch (error) {
      console.error("Error fetching children:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChildCreated = (newChild: Child) => {
    setChildren(prev => [...prev, newChild])
    setShowCreateDialog(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR').format(date)
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/dicere-logo.jpeg" 
                alt="DICERE Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DICERE</h1>
                <p className="text-sm text-gray-500">Dashboard de Cuidadores</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Bem-vindo, {session?.user?.name?.split(' ')[0]}! 👋
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Gerencie os perfis das crianças e acompanhe o progresso na comunicação.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Criança
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : children.length === 0 ? (
          <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-6">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma criança cadastrada</h3>
              <p className="text-gray-500 text-center mb-6">
                Adicione o primeiro perfil de criança para começar a usar o DICERE.
              </p>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Primeira Criança
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <Card key={child.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        {child.profilePhoto ? (
                          <img src={child.profilePhoto} alt={child.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <AvatarFallback className="bg-green-100 text-green-600 text-lg font-semibold">
                            {child.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{child.name}</CardTitle>
                        {child.birthDate && (
                          <CardDescription className="text-sm text-gray-500">
                            {calculateAge(child.birthDate)} anos
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Activity className="h-4 w-4" />
                      <span>{child._count.sequences} comunicações</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{child._count.reports} relatórios</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {child.childAccess.map((access) => (
                      <Badge key={access.user.id} variant="secondary" className="text-xs">
                        {access.user.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Link href={`/aac/${child.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comunicar
                      </Button>
                    </Link>
                    <Link href={`/reports/${child.id}`}>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <CreateChildDialog 
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onChildCreated={handleChildCreated}
      />
    </div>
  )
}
