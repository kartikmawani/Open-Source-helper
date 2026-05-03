import axios from 'axios';  
axios.defaults.withCredentials = true;
import {
  QueryClient,
  QueryClientProvider,
  
} from '@tanstack/react-query'
import {HomeTab}from './pages/Home.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter,Navigate, RouterProvider } from 'react-router-dom';
import {MainLayout} from './pages/MainLayout'
import {Login} from './pages/LoginPage.js'
import {ProtectedRoute} from './ components/ProtectedRoutes.js'
import {AnalysisView} from './pages/AnalyzeRepo'
import {GeminiTab} from './pages/GeminiHelp.js'
 
 const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>,  
  },
  {
    
    element: <ProtectedRoute/>, 
    children: [
      {
        element: <MainLayout />,  
        children: [
          {
            path: "/",
            element: <HomeTab />,
          },
          {
            path:"/Analyze/:repos",
            element:<AnalysisView/>
           },
           {
            path:'/gemini',
            element:<GeminiTab/>
           }
          
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,  
  },
]);

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>

      <RouterProvider router={router}></RouterProvider>

      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>
    </>
  )
}
export default App

 


 