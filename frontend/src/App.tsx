import {
  QueryClient,
  QueryClientProvider,
  
} from '@tanstack/react-query'
import {HomeTab}from './pages/Home'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter,Navigate, RouterProvider } from 'react-router-dom';
import {MainLayout} from './pages/MainLayout'
import {Login} from './pages/loginPage'
import {ProtectedRoute} from './utils/ProtectedRoutes'
import {AnalysisView} from './pages/AnalyzeRepo'
 const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login/>, // Your public login page
  },
  {
    // PROTECTED AREA
    element: <ProtectedRoute/>, 
    children: [
      {
        element: <MainLayout />, // Your layout with Header/Tabs
        children: [
          {
            path: "/",
            element: <HomeTab />,
          },
          {
            path:"/Analyze/:repos",
            element:<AnalysisView/>
           }
          // {
          //   path: "/gemini",
          //   element: <GeminiTab />,
          // },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />, // Catch-all redirect
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

 


 