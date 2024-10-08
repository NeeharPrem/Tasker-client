import axios from "axios";


const Api = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_URL || 'http://localhost:3000',
  withCredentials: true,
});


export default Api;