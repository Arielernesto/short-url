import { BrowserRouter as Router, Route , Routes, Outlet} from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import { Suspense } from "react"
import { Toaster } from "./components/ui/toaster"
import Home from "./components/home/Home"
import DashBoard from "./components/dashboard/Dash"

import './App.css'


function Layout(){
  return (
    <section>
      <Toaster />
      <Outlet />
    </section>
  )
}


function App() {
  

  return (
    <>
      <Suspense fallback={ 
        <div className="w-[100%] h-[100vh] flex justify-center items-center">
          <div className="loader"></div>
        </div>} >
      <Router> 
         <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home />}></Route>
            <Route  path="login" element={<Login />} />
            <Route  path="register" element={<Register />}></Route>
            <Route  path="console" element={<DashBoard />}></Route>
          </Route>
         </Routes>
    </Router>
    </Suspense>
    </>
  )
}

export default App
