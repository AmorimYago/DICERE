// app/login/page.tsx
"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MessageCircle, Heart } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Credenciais inválidas")
      } else {
        const session = await getSession()
        if (session?.user) {
          const role = (session.user as any).role
          const userId = session.user.id

          if (role === "CRIANCA") {
            router.replace(`/aac/${userId}`)
          } else {
            router.replace("/dashboard")
          }
        }
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <div className="relative">
              <MessageCircle className="h-10 w-10 text-blue-600" />
              <Heart className="h-5 w-5 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">AAC Comunicador</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Comunicação para Crianças Autistas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                Email do pai ou Nome da criança
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="seu@email.com ou Nome da criança"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-6">
          <div className="w-full text-center space-y-4">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Cadastre-se aqui
              </Link>
            </p>
            <div className="text-xs text-gray-500">
              <p>Feito com ❤️ para inclusão e comunicação</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}