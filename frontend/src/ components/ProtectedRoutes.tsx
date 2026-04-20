import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
export const ProtectedRoute = () => {
  const { data, isLoading } = useAuth();
 
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping"></div>
        <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
           Route is Loading
        </span>
      </div>
    );
  }

  
  return data?.loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};