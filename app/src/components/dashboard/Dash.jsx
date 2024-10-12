
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import { toast } from "../ui/use-toast"
import { LinkIcon, Home, CopyIcon, MoreVerticalIcon, PlusIcon, CheckIcon } from "lucide-react"
import { useAuthStore } from "../../store/AuthStore"
import { API_HOST } from "../../lib/config"
import z from 'zod'
import { useNavigate } from "react-router-dom"

export const API_URL = "https://short-url-azure.vercel.app/api/url" //TODO

export default function DashBoard() {
  const [urls, setUrls] = useState([])
  const [newUrl, setNewUrl] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [newShortenedUrl, setNewShortenedUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const session = useAuthStore(state => state.session)
  const getSession = useAuthStore(state => state.getAuth)
  const loading = useAuthStore(state => state.loading)
  const logOut = useAuthStore(state => state.logOut)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [closedSession, setClosedSession] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const navigate = useNavigate()
  const [charging, setCharging] = useState(false)

  async function HandleDelete(id){
    const pet = await fetch(`${API_HOST}/url/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    const link = await pet.json()
    if (link.error){
      return toast({
        variant: "destructive",
        title: link.error
      })
    }
    const newURLs = urls.filter(item => item.id != id)
    setUrls(newURLs)
    toast({
      title: link.message
    })
  }

  async function getURLs(){
    setCharging(true)
    const pet = await fetch(`${API_HOST}/url/`, {
      credentials: "include", 
      method: "POST"
    })
    const Urls = await pet.json()
    if (Urls.error) {
    return  toast({
        variant: "destructive",
        title: Urls.error
      })
    }
    setCharging(false)
    console.log(Urls)
    setUrls(Urls.URLs)
  }
  useEffect(() => {
    getSession()
    getURLs()
  }, []);

  useEffect(() => {
    if (session.auth == true) {
      setIsLoggedIn(true)
      
    }
  }, [session]);

  const handleCreateUrl = async (e) => {
    e.preventDefault()
    const urlSchema = z.string().url()
    const result =  urlSchema.safeParse(newUrl)
    if (result.error) {
      return toast({
        variant: "destructive",
        title: "Ingrese una url correcta"
      })
    }
    const pet = await fetch(`${API_HOST}/url/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({url: result.data})
    })
    const shortenedNewUrl = await pet.json()
    if (shortenedNewUrl.error) {
      toast({
        variant: "destructive",
        title: shortenedNewUrl.error
      })
    }
    setNewShortenedUrl(shortenedNewUrl.url)
    const newUrlObject = {
      id: shortenedNewUrl.id,
      shortened: `${API_URL}/${shortenedNewUrl.id}`,
      url: shortenedNewUrl.original,
      clicks: 0
    }
    setIsDisabled(false)
    setUrls([...urls, newUrlObject])
    setIsCreateModalOpen(false)
    setIsSuccessModalOpen(true)
    setNewUrl("")
  }

  const handleCopy = async (url) => {
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    toast({
      title: "URL copiada",
      description: "La URL acortada ha sido copiada al portapapeles.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  
  if (!isLoggedIn && loading) {
    return "Cargando"
  }

  if (session.isAuth === "500" || closedSession) {
    return (
      <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
        <span className="text-2xl font-bold">Acceso no autorizado</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/") }>
            <LinkIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 xs:inline 2xs:hidden hidden" >ShortLink Dashboard</span>
          </div>
          <div className="flex items-center flex-row-reverse gap-x-2">
          <Button variant="outline" onClick={() => {logOut(); setIsLoggedIn(false); setClosedSession(true); navigate("/")}} >Cerrar sesión</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-[16px]">Mis URLs acortadas</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Nueva URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva URL acortada</DialogTitle>
                <DialogDescription>
                  Ingresa la URL que deseas acortar a continuación.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUrl}>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://ejemplo.com/tu-url-larga"
                  className="mb-4"
                />
                <DialogFooter>
                  <Button type="submit" disabled={isDisabled ? true : false}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="40" height="40" style={{shapeRendering: "auto", display: isDisabled ? "block" : "none"}}><g><g transform="rotate(0 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="63" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(30 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(60 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(90 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(120 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(150 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(180 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(210 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(240 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(270 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(300 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
</g><g transform="rotate(330 50 50)">
  <rect fill="#ffffff" height="12" width="6" ry="6" rx="3" y="24" x="47">
    <animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
  </rect>
                  </g><g></g></g></svg>
                    Crear URL acortada
                    </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL Original</TableHead>
                <TableHead>URL Acortada</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              { !charging && urls.length > 0 && urls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="font-medium">{url.url}</TableCell>
                  <TableCell>{`${API_URL}/${url.id}`}</TableCell>
                  <TableCell>{url.clicks}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleCopy(`${API_URL}/${url.id}`)}>
                          <CopyIcon className="mr-2 h-4 w-4" />
                          Copiar URL acortada
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-red-600"  onClick={() => HandleDelete(url.id)} >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!charging && urls.length == "0" &&
          (
          <div className=" font-bold text-lg text-center  w-[100%] mt-5 mb-5">Ups! No tienes Urls acortadas</div> 
          )}
          { charging &&
          <div className=" font-bold text-lg text-center   w-[100%] mt-5 mb-5">Cargando...</div>
          }
          
         

        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total de URLs</h2>
            <p className="text-3xl font-bold text-indigo-600">{urls.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total de clics</h2>
            <p className="text-3xl font-bold text-indigo-600">
              { urls.length > 0 ? urls.reduce((sum, url) => parseInt(sum) + parseInt(url.clicks), 0) : 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">URL más popular</h2>
            <p className="text-lg font-medium text-gray-800 text-[15px]">
              { urls.length > 0 ? `${API_URL}/${urls.reduce((max, url) => parseInt(max.clicks) > parseInt(url.clicks) ? max : url, urls[0]).id}` : ""}
            </p>
          </div>
        </div>
      </main>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>URL acortada con éxito</DialogTitle>
            <DialogDescription>
              Tu nueva URL acortada está lista para ser utilizada.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={newShortenedUrl} readOnly />
            <Button onClick={() => handleCopy(newShortenedUrl)} className="w-12">
              {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}