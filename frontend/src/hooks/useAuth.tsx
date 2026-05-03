import axios from "axios";
import {useQuery} from '@tanstack/react-query'
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
         
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/current_user`, {
          withCredentials: true, 
        });
        return res.data;
      } catch (err) {
      
        return null; 
      }
    },
    retry: false,  
    staleTime: 1000 * 60 * 5,  
  });
};