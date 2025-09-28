import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import UI from './pages/UI'
import routerUtils from './utils/routerUtils'
import Template from './components/Template'

function App() {

  const publicRoutes = [
    {
      path:"/ui",
      element:<UI/>
    },
    {
      path:"/chat",
      element:<Template> <Chat /> </Template>
    },
  ]

  const authenticatedRoutes = [
    {
      path:"/",
      element:<Home />
    },
    
  ]

  const noneAuthenticatedRoutes = [
    {
      path:"/login",
      element:<Login />
    },
    {
      path:"/signup",
      element:<SignUp />
    }
  ]


  const router = createBrowserRouter(routerUtils.creatRoutes(publicRoutes,noneAuthenticatedRoutes,authenticatedRoutes))


  return (
    <div className='h-screen w-screen relative bg-primary-light dark:bg-primary-dark'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
