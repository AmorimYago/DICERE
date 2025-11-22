
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Users, BarChart3, Upload, Volume2 } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-8">
                  <img 
                    src="/dicere-logo.jpeg" 
                    alt="DICERE Logo" 
                    className="h-32 w-auto object-contain"
                  />
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">DICERE</span>{" "}
                  <span className="block text-blue-600 xl:inline">Comunicação para Crianças Autistas</span>
                </h1>
                
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Uma ferramenta de comunicação alternativa e aumentativa (AAC) especialmente projetada 
                  para crianças autistas. Baseado no sistema PECS e nas melhores práticas de design inclusivo.
                </p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/register">
                      <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200">
                        Começar Agora
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/login">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200">
                        Já tenho conta
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Funcionalidades</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tudo que você precisa para comunicação AAC
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Um conjunto completo de ferramentas para apoiar a comunicação de crianças autistas.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500 text-white shadow-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Interface AAC Intuitiva</h3>
                  <p className="mt-2 text-base text-gray-500">
                    13 categorias organizadas com imagens claras e navegação simples para construir frases.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-green-500 text-white shadow-lg">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Text-to-Speech</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Reprodução de áudio para palavras individuais e frases completas em português.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500 text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Múltiplos Cuidadores</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Pais, terapeutas e educadores podem colaborar no cuidado da mesma criança.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-yellow-500 text-white shadow-lg">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Imagens Personalizadas</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Adicione fotos familiares e objetos conhecidos da criança para melhor comunicação.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-500 text-white shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios Diários</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Acompanhe o progresso com relatórios automáticos de uso e comunicação.
                  </p>
                </div>
              </div>

              <div className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-red-500 text-white shadow-lg">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Design Inclusivo</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Desenvolvido seguindo as melhores práticas para crianças autistas e necessidades especiais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-blue-200">Crie sua conta gratuitamente.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Ajude sua criança a se comunicar melhor com nossa plataforma AAC especializada.
          </p>
          <Link href="/register">
            <Button className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-blue-50 sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
