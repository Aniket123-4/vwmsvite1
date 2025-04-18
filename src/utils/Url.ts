import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const HOST_URL='https://vwmsreactapi.mssplonline.com/api/';
//export const HOST_URL = 'http://103.12.1.132:8185/api/';
// export const HOST_URL = 'https://localhost:7237/api/';



export const Bot_URL = 'http://192.168.1.57:8096/chat/project1';
export const Chat = axios.create({
  baseURL: Bot_URL,
});




const api = axios.create({
  baseURL: HOST_URL,
});

api.interceptors.request.use(
  (config) => {
    const tokenWithQuotes = sessionStorage.getItem('token');

const token = tokenWithQuotes?.replace(/^"(.*)"$/, '$1');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      Logout();
    }
    return Promise.reject(error);
  }
);

function Logout() {
  
  localStorage.clear();
  sessionStorage.clear();
  toast.success("Token expired. Logging out...");
  const navigate=useNavigate();
  navigate("/");
}


export default api;


