
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { LinkIcon, BarChartIcon, ShieldCheckIcon, LogOut, PanelLeft, ChevronDown, User, ZapIcon, CopyIcon, CheckIcon } from "lucide-react"
import { toast } from "../ui/use-toast"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/AuthStore"
import { useEffect } from "react"
import z from 'zod'
import { API_HOST } from "../../lib/config"

export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState("")
  const [url, setUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const session = useAuthStore(state => state.session)
  const getSession = useAuthStore(state => state.getAuth)
  const loading = useAuthStore(state => state.loading)
  const logOut = useAuthStore(state => state.logOut)
  useEffect(() => {
    getSession()
  }, []);

  useEffect(() => {
    if (session.auth == true) {
      setIsLoggedIn(true)
      setUsername(session.name)
    } else {
      setIsLoggedIn(false)
    }
  }, [session]);

  const handleShorten = async (e) => {
    e.preventDefault()
    const urlSchema = z.string().url()

    const result =  urlSchema.safeParse(url)
    if (result.error) {
      return toast({
        variant: "destructive",
        title: "Ingrese una url correcta"
      })
    }
    setIsDisabled(true)
    
    const pet = await fetch(`${API_HOST}/url/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({url: result.data})
    })
    const NewUrl = await pet.json()
    setShortenedUrl(NewUrl.url)
    setIsDisabled(false)
    toast({
      title: "Url Acortada con éxito!"
    })
  }

  const handleCopy = async () => {
    if (shortenedUrl) {
      await navigator.clipboard.writeText(shortenedUrl)
      setIsCopied(true)
      toast({
        title: "URL copiada",
        description: "La URL acortada ha sido copiada al portapapeles.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (!isLoggedIn && loading) {
    return "Cargando"
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <LinkIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 xs:inline 2xs:hidden hidden select-none">ShortLink</span>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="flex items-center">
                <span className="mr-4 text-gray-700">Hola, {username}</span>
                {/* <Button variant="outline" onClick={toggleLogin}>Cerrar sesión</Button> */}
                <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="relative bg-white">
                  <User className="h-10 w-10 rounded-full bg-[#eee] p-2 text-black" />
                  <ChevronDown className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#222] text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#fff] text-black">
                <DropdownMenuItem className="">

                  <Link to="/console" className=" w-full h-full flex gap-x-2 items-center">
                  <PanelLeft className="w-4 h-4"/>
                  Panel
                  </Link>

                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className=" flex gap-x-2 cursor-pointer" onClick={() => {logOut(); setIsLoggedIn(false) }}>
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              </div>
            ) : (
              <>
                <Button variant="outline" className="mr-2">
                  <Link to="/login" className="hover:text-black w-full h-full">
                  Iniciar sesión
                  </Link>
                  </Button>

                <Button  className="">
                  <Link to="/register" className="hover:text-white  w-full">
                  Registrarse
                  </Link>
                  </Button>

              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Acorta tus URLs en segundos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Simplifica tus enlaces y haz un seguimiento de tus clics con nuestra potente herramienta de acortamiento de URLs.
            </p>
            <form onSubmit={handleShorten} className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="flex gap-4">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Pega tu enlace largo aquí"
                  className="flex-grow"
                  required
                />
                <Button type="submit"  size={isDisabled ? "" : "lg"} disabled={isDisabled}>
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
                  Acortar
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={shortenedUrl}
                  placeholder="Tu URL acortada aparecerá aquí"
                  className="flex-grow"
                  readOnly
                />
                <Button
                  type="button"
                  onClick={handleCopy}
                  variant="outline"
                  className="w-12"
                  aria-label="Copiar al portapapeles"
                >
                  {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </form>
            {!isLoggedIn && (
              <p className="text-sm text-gray-600 mb-4">
                Para administrar tus URLs acortadas, <Link to="/login" className="text-indigo-600 hover:underline">inicia sesión</Link> o <Link to="/register" className="text-indigo-600 hover:underline">crea una cuenta</Link>.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              ¿Por qué elegir ShortLink?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ZapIcon className="h-8 w-8 text-indigo-600" />}
                title="Rápido y sencillo"
                description="Acorta tus URLs en segundos con nuestra interfaz intuitiva."
              />
              <FeatureCard
                icon={<BarChartIcon className="h-8 w-8 text-indigo-600" />}
                title="Analíticas detalladas"
                description="Obtén información valiosa sobre el rendimiento de tus enlaces."
              />
              <FeatureCard
                icon={<ShieldCheckIcon className="h-8 w-8 text-indigo-600" />}
                title="Seguro y confiable"
                description="Tus datos están protegidos con nuestra tecnología de encriptación."
              />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                {isLoggedIn ? "Comienza a acortar tus URLs ahora mismo." : "Regístrate gratis y comienza a acortar tus URLs hoy mismo."}
              </p>
             
                <Button size="lg" variant="secondary">
                  <Link to={isLoggedIn ? "/console" : "/register"} className="text-black w-full h-full flex items-center hover:text-black gap-x-2">
                  { isLoggedIn && <PanelLeft className="w-6 h-6"/> }
                  <span className=" text-md font-bold">{isLoggedIn ? "Panel" : "Crear cuenta gratis"}</span>
                  </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-4 sm:mb-0">&copy; 2024 ShortLink. Desarrollado por ExoCode.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
