import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { userSchema } from "../../lib/Schemas"
import { API_HOST } from "../../lib/config"
import { toast } from "../ui/use-toast"
import { useNavigate, Link } from "react-router-dom"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const navigate = useNavigate()

  async function Register(event){
    event.preventDefault()
    const results = userSchema.safeParse({name, password, email})
    if (results.error) {
      results.error.issues.map((error) => {
        switch (error.path[0]) {
          case "name":
            setNameError(error.message)
            break;
          case "email":
            setEmailError(error.message)
            break;
          case "password":
            setPasswordError(error.message)
            break;
          default:
            return
        }
      })
      return
    }
    if (password != confirmPassword) {
      return setConfirmPasswordError("La contraseña confirmada es incorrecta")
    }

    const pet = await fetch(API_HOST  +  "/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name, email, password})
    })
    const user = await pet.json()
    if (user.error) {
      toast({
        variant: "destructive",
        title: user.error,
      })
      return
    }
    toast({
      title: "Usted se ha registrado con éxito"
    })
    navigate("/")
  }
  return (
  <div className="flex justify-center mt-10">
    <div className="w-[320px] md:w-[450px] min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Crear cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre de usuario
              </Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Juan Pérez"
              />
             <span className="text-red-600 text-sm font-bold block mt-2 text-start">{nameError}</span>
            </div>
            <div>
              <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email-address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="tu@ejemplo.com"
              />
             <span className="text-red-600 text-sm font-bold block mt-2 text-start">{emailError}</span>
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
             <span className="text-red-600 text-sm font-bold block mt-2 text-start">{passwordError}</span>
            </div>
            <div>
              <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </Label>
              <Input
                id="password-confirm"
                name="password-confirm"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
             <span className="text-red-600 text-sm font-bold block mt-2 text-start">{confirmPasswordError}</span>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              onClick={(e) => Register(e)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}