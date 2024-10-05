import { BrowserRouter as Router, Route , Routes} from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import { Suspense } from "react"

import './App.css'

function App() {
  

  return (
    <>
      <Suspense fallback={ 
        <div className="w-[100%] h-[100vh] flex justify-center items-center">
          <div className="loader"></div>
        </div>} >
      <Router> 
         <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />}></Route>
         </Routes>
    </Router>
    </Suspense>
    </>
  )
}

export default App
