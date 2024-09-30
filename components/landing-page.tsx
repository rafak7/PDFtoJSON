'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Code, Zap, Shield, Upload, Copy } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'

export function LandingPageComponent() {
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [jsonResult, setJsonResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string>('')  // Estado para a URL da API
  const [postResponse, setPostResponse] = useState<string | null>(null)  // Estado para a resposta do POST
  const [isCopied, setIsCopied] = useState(false)
  const jsonResultRef = useRef<HTMLPreElement>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setJsonResult(null)
    setError(null)
    setPostResponse(null)  // Limpa o estado da resposta do POST quando um novo arquivo é carregado
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email enviado:', email)
    setEmail('')
  }

  const handleConvert = async () => {
    if (file) {
      setIsConverting(true)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64File = reader.result?.toString().split(',')[1]

        try {
          const response = await fetch('/api/convert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file: base64File }),
          })

          const data = await response.json()

          if (response.ok) {
            setJsonResult(data.json)
          } else {
            setError(data.error || 'Ocorreu um erro durante a conversão')
          }
        } catch (error) {
          console.error('Erro na conversão do PDF:', error);
          setError('Ocorreu um erro inesperado ao converter o PDF');
        } finally {
          setIsConverting(false)
        }
      }
    }
  }

  const handleCopyJson = () => {
    if (jsonResultRef.current && jsonResult) {
      navigator.clipboard.writeText(jsonResult)
        .then(() => {
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
        })
        .catch(err => console.error('Falha ao copiar o texto: ', err))
    }
  }

  // Função para enviar o JSON convertido para uma URL fornecida
  const handleSendPost = async () => {
    if (url && jsonResult) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonResult,
        })

        const responseData = await response.json()
        setPostResponse(JSON.stringify(responseData, null, 2))  // Formata a resposta da API
      } catch (err) {
        setPostResponse('Erro ao enviar o JSON para a URL fornecida.')
        console.error('Erro ao enviar o JSON:', err)
      }
    } else {
      setPostResponse('Por favor, forneça uma URL válida e converta um PDF antes de enviar.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-center">
        <Link className="flex items-center justify-center" href="#">
          <FileText className="h-6 w-6 mr-2" />
          <span className="font-bold">PDFtoJSON</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Recursos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#convert">
            Converter
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
            Contato
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transforme PDFs em JSON para Mapeamento Fácil de POST
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Simplifique seu processo de teste de API. Converta PDFs em dados JSON estruturados, perfeitos para testes de payload de requisições POST e desenvolvimento.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <a href="#convert">Começar</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#features">Saiba Mais</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12">
              Recursos para Desenvolvedores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Code className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">JSON Pronto para API</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Gere estruturas JSON otimizadas para payloads de API e requisições POST.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Conversão Rápida</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Acelere seu ciclo de desenvolvimento com transformação instantânea de PDF para JSON.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Focado no Desenvolvedor</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Adaptado para fluxos de trabalho de teste e desenvolvimento de API.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="convert" className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Converta Seu PDF
            </h2>
            <div className="max-w-md mx-auto">
              <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                {file ? (
                  <p className="text-sm text-gray-500">{file.name}</p>
                ) : isDragActive ? (
                  <p className="text-sm text-gray-500">Solte o arquivo PDF aqui...</p>
                ) : (
                  <p className="text-sm text-gray-500">Arraste e solte um arquivo PDF aqui, ou clique para selecionar um</p>
                )}
              </div>

              <Button
                className="w-full mt-4"
                onClick={handleConvert}
                disabled={!file || isConverting}
              >
                {isConverting ? 'Convertendo...' : 'Converter para JSON'}
              </Button>

              {jsonResult && (
                <>
                  <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">JSON Convertido:</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyJson}
                        className="flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {isCopied ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </div>
                    <pre
                      ref={jsonResultRef}
                      className="mt-2 text-left text-sm text-gray-700 overflow-x-auto"
                    >
                      {jsonResult}
                    </pre>
                  </div>

                  {/* Seção para inserir a URL e enviar o JSON */}
                  <div className="mt-6">
                    <Input
                      type="url"
                      placeholder="Insira a URL para envio do JSON"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mb-4"
                    />
                    <Button className="w-full" onClick={handleSendPost}>
                      Enviar JSON via POST
                    </Button>

                    {/* Exibir resposta da requisição POST */}
                    {postResponse && (
                      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Resposta do POST:</h3>
                        <pre className="mt-2 text-left text-sm text-gray-700 overflow-x-auto">
                          {postResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}

              {error && (
                <div className="mt-6 bg-red-100 p-4 rounded-lg text-red-600">
                  <p>Erro: {error}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para Transformar Seus PDFs?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Inscreva-se em nossa newsletter para receber atualizações e acesso antecipado.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">Inscrever-se</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 PDFparaJSON para Devs. Todos os direitos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
