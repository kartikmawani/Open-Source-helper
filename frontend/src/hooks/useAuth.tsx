
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const res = await axios.get('http://localhost/api/current_user', {
          withCredentials: true,  //it is required otherwise backend  will not   recognized required cookies
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